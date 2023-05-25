import express from 'express';
import { getAllBatches } from '../db/queries/batches.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const batches = await getAllBatches();
        if (batches === false) {
            console.error(`Error (/batch) - ${error}`)
            res.send({ status: 500, error: "Internal server error" }).status(500)
            return;
        }

        res.send({ status: 200, batches: batches }).status(200)
    } catch (error) {
        console.error(`Error (/batch) - ${error}`)
        res.send({ status: 500, error: "Internal server error" }).status(500)
    }
})

export default router;