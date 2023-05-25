import { ObjectId } from 'mongodb';
import db from "../conn.mjs";

export const createBatch = async (fileName) => {
    try {
        const collection = db.collection('batches');
    
        const batch = {
            _id: new ObjectId(),
            fileName: fileName,
            status: 'queued',
            reports: {
                sourceRep: null,
                branchRep: null,
                statusRep: null,
            },
            createdAt: new Date(),
        };
    
        const result = await collection.insertOne(batch);
        
        console.log(`Batch: created batch with id: ${result.insertedId}`)
        return result.insertedId;
    } catch (error) {
        console.error(`Batch: there was an error with 'createBatch': ${error}`);
        return false;
    }
}

export const getBatchById = async (batchId) => {
    try {
        const collection = db.collection('batches');

        const query = { _id: ObjectId(batchId) };

        const result = await collection.findOne(query);
        if (!result) {
            return false
        }

        console.log(`Batch: retreived batch with id: ${batchId}`)
        return result
    } catch (error) {
        console.error(`Batch: there was an error retrieving batch with id: ${batchId} - ${error}`);
        return false;
    }
}

export const updateBatchStatus = async(batchId, status) => {
    try {
        const collection = db.collection('batches');
        const query = { _id: ObjectId(batchId) }
        const updates = {
            $set: { "status": status },
        };

        const result = await collection.updateOne(query, updates);
        console.log(`Batch: updated batch status to "${status}" for id: ${batchId}`)
        return result;
    } catch (error) {
        console.error(`Batch: there was an error with updateBatchStatus: ${error}`);
    }
}

export const getAllBatches = async () => {
    try {
        const collection = db.collection('batches')
        const result = await collection.find({}).toArray()

        console.log("Batches: retreived all batches");
        return result;
    } catch (error) {
        console.error(`Batch: there was an error with getAllBatches: ${error}`);
        return false;
    }
}

export const updateBatchSourceReport = async (batchId, fileId) => {
    try {
        const collection = db.collection('batches');
        const query = { _id: ObjectId(batchId) }
        const updates = {
            $set: { "reports.sourceRep": fileId },
        };

        const result = await collection.updateOne(query, updates);
        console.log(`Batch: updated batch source report for id: ${batchId}`)
        return result;
    } catch (error) {
        console.error(`Batch: there was an error with updateBatchSourceReport: ${error}`);
        return false;
    }
}

export const updateBatchBranchReport = async (batchId, fileId) => {
    try {
        const collection = db.collection('batches');
        const query = { _id: ObjectId(batchId) }
        const updates = {
            $set: { "reports.branchRep": fileId },
        };

        const result = await collection.updateOne(query, updates);
        console.log(`Batch: updated batch branch report for id: ${batchId}`)
        return result;
    } catch (error) {
        console.error(`Batch: there was an error with updateBatchBranchReport: ${error}`);
        return false;
    }
}

export const updateBatchStatusReport = async (batchId, fileId) => {
    try {
        const collection = db.collection('batches');
        const query = { _id: ObjectId(batchId) }
        const updates = {
            $set: { "reports.statusRep": fileId },
        };

        const result = await collection.updateOne(query, updates);
        console.log(`Batch: updated batch status report for id: ${batchId}`)
        return result;
    } catch (error) {
        console.error(`Batch: there was an error with updateBatchStatusReport: ${error}`);
        return false;
    }
}

export const updateBatchReportNull = async (batchId, key) => {
    try {
        const collection = db.collection('batches');
        
        const query = { _id: ObjectId(batchId) }
        const vals = {}
        vals[key] = null
        const updates = {
            $set: vals,
        };

        const result = await collection.updateOne(query, updates);
        console.log(`Batch: updated batch report ${key} to null for id: ${batchId}`)
        return result;
    } catch (error) {
        console.error(`Batch: there was an error with updateBatchReportNull and key ${key}: ${error}`);
        return false;
    }
}