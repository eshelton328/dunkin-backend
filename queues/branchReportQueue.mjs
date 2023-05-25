import { getPaymentsByStatusBatch } from "../db/queries/payments.mjs";
import { createCSV } from "../utils/createCSV.mjs";
import { createUpdateBranchReport } from "../controllers/branchReport.mjs";

export const branchReportQueue = async (data) => {
    const { batchId } = data;
    try {
        const payments = await getPaymentsByStatusBatch(batchId, "done");
        if (!payments) {
            console.error("Error: branchReportQueue did not find any payments")
            return
        }

        let cache = {}
        for (const payment of payments) {
            const { amount, employee } = payment
            const dunkinBranch = employee.dunkinBranch

            if (dunkinBranch in cache) {
                cache[dunkinBranch].total = (parseFloat(cache[dunkinBranch].total) + amount).toFixed(2);
            } else {
                cache[dunkinBranch] = {
                    dunkinBranch: dunkinBranch,
                    total: amount,
                };
            }
        }

        const headers = ["dunkinBranch", "amount"];
        const body = Object.values(cache)
        const csvString = createCSV(headers, body);
    
        await createUpdateBranchReport(batchId, csvString);
    } catch (error) {
        console.error(`Branch Report: branch report queue failed for batchId: ${batchId} - ${error}`);
    }
};