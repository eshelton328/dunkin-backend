import express from 'express';
import csvParser from 'csv-parser';
import { deleteReportByFileName, getReportByFileName } from '../db/queries/reports.mjs';
import { updateBatchReportNull } from '../db/queries/batches.mjs';
import queue from '../queues/queue.mjs';

const router = express.Router();

router.get('/source/:id', async (req, res) => {
    const fileName = req.params.id;

    try {
        const stream = await getReportByFileName(fileName, "sourceReports");
        stream.pipe(csvParser());
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        stream.pipe(res)
    } catch (error) {
        console.error(`Error: ${error}`)
        res.send({ status: 500, error: error }).status(500); 
    }
})

router.get('/branch/:id', async (req, res) => {
    const fileName = req.params.id;

    try {
        const stream = await getReportByFileName(fileName, "branchReports");
        stream.pipe(csvParser());
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        stream.pipe(res)
    } catch (error) {
        console.error(`Error: ${error}`)
        res.send({ status: 500, error: error }).status(500); 
    }
})

router.get('/status/:id', async (req, res) => {
    const fileName = req.params.id;

    try {
        const stream = await getReportByFileName(fileName, "statusReports");
        stream.pipe(csvParser());
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        stream.pipe(res)
    } catch (error) {
        console.error(`Error: ${error}`)
        res.send({ status: 500, error: error }).status(500); 
    }
})

router.get('/refresh/:id', async (req, res) => {
    const batchId = req.params.id;

    try {
        const fileName = `${batchId}.csv`;

        let result = await deleteReportByFileName(fileName, "sourceReports")
        if (!result) {
            throw new Error('Failed to delete source report');
        }
        result = await updateBatchReportNull(batchId, "reports.sourceRep")
        if (!result) {
            throw new Error('Failed to update batch');
        }
        result = await deleteReportByFileName(fileName, "branchReports")
        if (!result) {
            throw new Error('Failed to delete branch report');
        }
        result = await updateBatchReportNull(batchId, "reports.branchRep")
        if (!result) {
            throw new Error('Failed to update batch');
        }
        result = await deleteReportByFileName(fileName, "statusReports")
        if (!result) {
            throw new Error('Failed to delete status report');
        }
        result = await updateBatchReportNull(batchId, "reports.statusRep")
        if (!result) {
            throw new Error('Failed to update batch');
        }

        queue.add('sourceReport', { batchId });
        queue.add('branchReport', { batchId });
        queue.add('statusReport', { batchId });
    } catch (error) {
        console.error(`Error: ${error}`)
        res.send({ status: 500, error: error }).status(500); 
    }
})

export default router;