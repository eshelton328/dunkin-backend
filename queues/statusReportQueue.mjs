import { bulkUpdatePayments, getPaymentsByStatusBatch } from "../db/queries/payments.mjs";
import { createUpdateStatusReport, getPaymentStatuses } from "../controllers/statusReport.mjs";
import { createCSV } from "../utils/createCSV.mjs";

export const statusReportQueue = async (data) => {
    const { batchId } = data;
    try {
        const payments = await getPaymentsByStatusBatch(batchId, "done");
        if (!payments) {
            console.error("Error: statusReportQueue did not find any payments")
            return
        }

        const [updatedPayments, updates] = await getPaymentStatuses(payments);
        let body = []
        for (const payment of updatedPayments) {
            const data = payment.method
            body.push(data)
        }

        const headers = [
            "id",
            "source",
            "destination",
            "amount",
            "description",
            "status",
            "estimated_completion_date",
            "source_trace_id",
            "source_settlement_date",
            "destination_trace_id",
            "destination_settlement_date",
            "reversal_id",
            "fee",
            "type",
            "error",
            "metadata",
            "created_at",
            "updated_at",
            "fund_status",
        ]
        const csvString = createCSV(headers, body);

        await createUpdateStatusReport(batchId, csvString);

        if (updates.length) {
            await bulkUpdatePayments(updates)
        }
    } catch (error) {
        console.error(`Status Report: status report queue failed for batchId: ${batchId} - ${error}`);
    }
};