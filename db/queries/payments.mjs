import { ObjectId } from 'mongodb';
import db from "../conn.mjs";

export const createPayment = async (employee, payor, payee, batch, amount) => {
    try {
        const collection = db.collection('payments');
        const payment = {
            _id: new ObjectId(),
            employee: {
                _id: employee.id.toString(),
                dunkinBranch: employee.dunkinBranch,
            },
            payor: {
                _id: payor.id.toString(),
                accNum: payor.accNum,
            },
            payee: {
                _id: payee.id.toString(),
            },
            batch: {
                _id: batch.id.toString(),
            },
            amount: amount,
            status: 'queued',
            createdAt: new Date(),
        }

        const result = await collection.insertOne(payment);

        console.log(`Payment: created payment with id: ${result.insertedId}`)
        return result.insertedId;
    } catch (error) {
        console.error(`Payment: there was an error with createPayment: ${error}`);
        return false;
    }
}

export const createPayments = async (paymentBatch) => {
    try {
        const collection = db.collection('payments')
        const result = await collection.insertMany(paymentBatch)
        console.log(`Payments: created payments`)
        return true;
    } catch (error) {
        console.error(`Payments: there was an error with createPayments: ${error}`)
        return false;
    }
}

export const getPaymentsByBatch = async (batchId) => {
    try {
        const collection = db.collection('payments');
        const query = { "batch._id": batchId };

        const result = await collection.find(query).toArray();
        console.log(`Payments: retrieved payments with batchId: ${batchId}`)
        return result;
    } catch (error) {
        console.error(`Payments: there was an error with getPaymentsByBatch: ${error}`)
        return false;
    }
}

export const getPaymentsByStatusBatch = async (batchId, status) => {
    try {
        const collection = db.collection('payments');
        const query = { "batch._id": batchId, "status": status };

        const result = await collection.find(query).toArray();
        console.log(`Payments: retrieved payments with batchId: ${batchId} and status: ${status}`)
        return result;
    } catch (error) {
        console.error(`Payments: there was an error with getPaymentsByStatusBatch: ${error}`)
        return false;
    }
}

export const updatePaymentError = async (paymentId, errMsg) => {
    try {
        const collection = db.collection('payments');
        const query = { _id: paymentId };
        const update = {
            $set: {
                status: "error",
                error: errMsg,
            }
        }

        const result = await collection.updateOne(query, update);

        console.log(`Payments: updated status of payment with id: ${paymentId}`)
        return result;
    } catch (error) {
        console.error(`Payment: there was an error with updatePaymentError: ${error}`);
        return false;
    }
}

export const updatePaymentData = async (paymentId, data) => {
    try {
        const collection = db.collection('payments');
        const query = { _id: paymentId };
        const update = {
            $set: {
                method: {
                    ...data,
                },
                status: "done"
            }
        }

        const result = await collection.updateOne(query, update);

        console.log(`Payment: updated method data of payment with id: ${paymentId}`);
        return result;
    } catch (error) {
        console.error(`Payment: there was an error with updatePaymentData: ${error}`);
        return false;
    }
}

export const bulkUpdatePayments = async (updates) => {
    try {
        const collection = db.collection('payments');
        const updateOperations = updates.map((update) => ({
            updateOne: {
                filter: { _id: ObjectId(update.id) },
                update: { $set: { method: update.value } },
            }
          }));
        
          await collection.bulkWrite(updateOperations);
          return true;
    } catch (error) {
        console.error(`Payment: there was an error with bulkUpdatePayments: ${error}`);
        return false;
    }
}