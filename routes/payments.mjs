import express from 'express';
import queue from '../queues/queue.mjs';
import { createBatch } from '../db/queries/batches.mjs';

const router = express.Router();

router.post('/bulk', async (req, res) => {
    let { fileName, payments, batchId, jobNum, jobTotal } = req.body;
    if (!batchId) {
        batchId = await createBatch(fileName);
    }

    try {
        queue.add('createPayments', { payments, batchId, jobNum });
    } catch (error) {
        console.error(`Error: ${error}`)
    }

    if (jobNum === jobTotal) {
        queue.add('processPayments', { batchId })
    }

    res.send({ status: 200, batchId: batchId}).status(200);
})

export default router;