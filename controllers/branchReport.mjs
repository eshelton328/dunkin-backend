import { getBatchById, updateBatchBranchReport, updateBatchReportNull } from "../db/queries/batches.mjs";
import { createReport, deleteReportByFileName } from "../db/queries/reports.mjs";

export const createUpdateBranchReport = async (batchId, csvString) => {
    try {
        const fileName = `${batchId}.csv`
        const batchRec = await getBatchById(batchId);
        if (!batchRec) {
            return false;
        }
        let branchRepId = batchRec.reports.branchRep;
        if (branchRepId) {
            await deleteReportByFileName(fileName, "branchReports")
            await updateBatchReportNull(batchId, "reports.branchRep")
        }

        branchRepId = await createReport(fileName, csvString, "branchReports");
        if (!branchRepId) {
            return false
        }

        const res = await updateBatchBranchReport(batchId, branchRepId);
        if (!res) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Helper: there was an error with createUpdateBranchReport: ${error}`);
        return false;
    }
}