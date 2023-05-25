import queue from "./queue.mjs";
import { getPaymentsByStatusBatch } from "../db/queries/payments.mjs";
import { getMerchantPlaid } from "../api/merchants.mjs";
import { createGetPayor, createGetPayorAccount } from "../controllers/payors.mjs";
import { createGetEmployee, createGetEmployeeAccount } from "../controllers/employees.mjs";
import { updatePaymentError } from "../db/queries/payments.mjs";
import { createUpdatePayment } from "../controllers/payments.mjs";
import { updateBatchStatus } from "../db/queries/batches.mjs";

export const processPaymentsQueue = async (data) => {
    const { batchId } = data;
    try {
        await updateBatchStatus(batchId, "processing")
        const payments = await getPaymentsByStatusBatch(batchId, "queued");
        for (const payment of payments) {
            const { employee, payor, payee, amount } = payment;
            const plaidId = payee.plaidId
            const accNum = payee.accNum
    
            const amountCents = parseInt((parseFloat(amount) * 100).toFixed(0));
            if (amountCents < 100) {
                console.error(`Process Payments: amount is below minimum of $1... skipping payment with id: ${payment._id}`)
                const errMsg = `Amount is below minimum of $1: ${plaidId}`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
    
            const merchant = await getMerchantPlaid(plaidId);
            if (!merchant) {
                console.error(`Process Payments: there was an error finding the payee with plaidId ${plaidId}... skipping payment with id: ${payment._id}`)
                const errMsg = `Failed to find merchant with plaidId: ${plaidId}`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
    
            const employeeRec = await createGetEmployee(employee)
            if (!employeeRec) {
                console.error(`Process Payments: there was an error creating/getting employee...skipping payment with id: ${payment._id}`)
                const errMsg = `Error creating/finding employee`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
    
            const destinationAcc = await createGetEmployeeAccount(employeeRec, merchant.mch_id, accNum, plaidId);
            if (!destinationAcc) {
                console.error(`Process Payments: there was an error creating/getting destination account...skipping payment with id: ${payment._id}`)
                const errMsg = `Error creating/finding destination account`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
            
            const payorRec = await createGetPayor(payor);
            if (!payorRec) {
                console.error(`Process Payments: there was an error creating/getting payor...skipping payment with id: ${payment._id}`)
                errMsg = `Error creating/finding payor`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
    
            const sourceAccountId = await createGetPayorAccount(payorRec, payor.banking.accNum, payor.banking.abaRouting);
            if (!sourceAccountId) {
                console.error(`Process Payments: there was an error creating/getting source account...skipping payment with id: ${payment._id}`)
                const errMsg = `Error creating/finding source account`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
    
            const paymentStatus = await createUpdatePayment(payment._id, amountCents, sourceAccountId, destinationAcc, "Loan Pmt");
            if (!paymentStatus) {
                console.error(`Process Payments: there was an error making payment...skipping payment with id: ${payment._id}`)
                const errMsg = `Error making payment`;
                await updatePaymentError(payment._id, errMsg)
                continue;
            }
        }

        await updateBatchStatus(batchId, "done");
        queue.add('sourceReport', { batchId });
        queue.add('branchReport', { batchId });
        queue.add('statusReport', { batchId });
    } catch (error) {
        console.error(`Process Payments: process payments queue failed for batchId: ${batchId} - ${error}`);
        await updateBatchStatus(batchId, 'error');
    }
};