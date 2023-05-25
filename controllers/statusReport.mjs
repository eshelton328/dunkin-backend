import { getBatchById, updateBatchStatusReport, updateBatchReportNull } from "../db/queries/batches.mjs";
import { deleteReportByFileName } from "../db/queries/reports.mjs";
import { createReport } from "../db/queries/reports.mjs";
import { getPayment } from "../api/payments.mjs";
import { rateLimit } from "../utils/rateLimit.mjs";

export const getPaymentStatuses = async (payments) => {
    try {
        let apiCount = 0;
        let startTime = new Date();
        let result = payments;
        let differnt = [];
        for (let i = 0; i < result.length; i++) {
            let payment = result[i]
            const paymentId = payment.method.id
            const updatedPayment = await getPayment(paymentId);
            if (!updatedPayment) {
                continue;
            }

            apiCount++
            [apiCount, startTime] = await rateLimit(apiCount, startTime)
            
            if (JSON.stringify(payment.method) !== JSON.stringify(updatedPayment)) {
                payment.method = updatedPayment
                result[i] = payment
                differnt.push({ id: payment._id, value: updatedPayment })
            }
        }

        return [result, differnt];
    } catch (error) {
        console.error(`Helper: there was an error with getPaymentStatuses: ${error}`);
        return false;
    }
}

export const createUpdateStatusReport = async (batchId, csvString) => {
    try {
        const batchRec = await getBatchById(batchId);
        if (!batchRec) {
            return false;
        }
        let statusRepId = batchRec.reports.statusRep;
        if (statusRepId) {
            await deleteReportByFileName(fileName, "statusReports")
            await updateBatchReportNull(batchId, "reports.statusRep")
        }

        const fileName = `${batchId}.csv`
        statusRepId = await createReport(fileName, csvString, "statusReports");
        if (!statusRepId) {
            return false
        }

        const res = await updateBatchStatusReport(batchId, statusRepId);
        if (!res) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Helper: there was an error with createUpdateStatusReport: ${error}`);
        return false;
    }
}