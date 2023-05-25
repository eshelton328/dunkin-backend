import { getBatchById, updateBatchSourceReport, updateBatchReportNull } from "../db/queries/batches.mjs";
import { deleteReportByFileName } from "../db/queries/reports.mjs";
import { createReport } from "../db/queries/reports.mjs";

export const createUpdateSourceReport = async (batchId, csvString) => {
    try {
        // get batch record
        const batchRec = await getBatchById(batchId);
        if (!batchRec) {
            return false;
        }
        let sourceRepId = batchRec.reports.sourceRep;
        if (sourceRepId) {
            await deleteReportByFileName(fileName, "sourceReports")
            await updateBatchReportNull(batchId, "reports.sourceRep")
        }

        const fileName = `${batchId}.csv`
        sourceRepId = await createReport(fileName, csvString, "sourceReports");
        if (!sourceRepId) {
            return false
        }

        const res = await updateBatchSourceReport(batchId, sourceRepId);
        if (!res) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Helper: there was an error with createUpdateSourceReport: ${error}`);
        return false;
    }
}