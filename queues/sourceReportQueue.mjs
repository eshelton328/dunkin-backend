import { findSourceAccount } from "../utils/findSourceAccount.mjs";
import { createCSV } from "../utils/createCSV.mjs";
import { createUpdateSourceReport } from "../controllers/sourceReport.mjs";
import { getPaymentsByStatusBatch } from "../db/queries/payments.mjs";
import { getPayorByEIN } from "../db/queries/payors.mjs";

export const sourceReportQueue = async (data) => {
    const { batchId } = data;
    try {
        const payments = await getPaymentsByStatusBatch(batchId, "done");
        if (!payments) {
            console.error("Error: sourceReportQueue did not find any payments")
            return
        }

        let cache = {}
        for (const payment of payments) {
            const { amount, payor } = payment;
            const { accNum, abaRouting } = payor.banking

            const key = `${accNum}:${abaRouting}`

            if (key in cache) {
                cache[key].total = (parseFloat(cache[key].total) + amount).toFixed(2);
            } else {
                const payorRec = await getPayorByEIN(payor.ein)
                if (!payorRec) {
                    continue;
                }
                const accounts = payorRec.method.accounts;
                const accountId = findSourceAccount(accounts, accNum, abaRouting);
                if (!accountId) {
                    continue;
                }
                cache[key] = {
                    accountId: accountId,
                    accNum: accNum,
                    abaRouting: abaRouting,
                    total: amount,
                };
            }
        }

        const headers = ["accountId", "accNum", "abaRouting", "amount"];
        const body = Object.values(cache)
        const csvString = createCSV(headers, body);

    
        await createUpdateSourceReport(batchId, csvString);
    } catch (error) {
        console.error(`Source Report: source report queue failed for batchId: ${batchId} - ${error}`);
    }
};