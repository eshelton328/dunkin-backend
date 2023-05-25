import { ObjectId } from 'mongodb';
import db from "../conn.mjs";

export const createPayor = async (data, entityId) => {
    try {
        const collection = db.collection('payors');
        const payor = {
            _id: new ObjectId(),
            name: data.name,
            dba: data.dba,
            ein: data.ein,
            address: {
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                zip: data.address.zip
            },
            method: {
                entityId: entityId,
                accounts: [],
            },
            createdAt: new Date(),
        }

        const result = await collection.insertOne(payor);

        console.log(`Payor: created payor with id: ${result.insertedId}`)
        return result.insertedId;
    } catch (error) {
        console.error(`Payor: there was an error with createPayor: ${error}`);
        return false;
    }
}

export const getPayorByAccNum = async (accNum) => {
    try {
        const collection = db.collection('payors');

        const query = { 'banking.accNum': accNum }
        const result = await collection.findOne(query);
        if (!result) {
            return false
        }

        console.log(`Payor: retreived payor with accNum: ${accNum}`)
        return result.insertedId
    } catch (error) {
        console.error(`Payor: there was an error retrieving payor with accNum: ${accNum} - ${error}`);
        return false;
    }
}

export const getPayorByEIN = async (ein) => {
    try {
        const collection = db.collection('payors');
        const query = { 'ein': ein };
        const result = await collection.findOne(query);
        if (!result) {
            console.log(`Payor: did not find payor with ein: ${ein}`)
            return false;
        }

        console.log(`Payor: retreived payor with ein: ${ein}`)
        return result;
    } catch (error) {
        console.error(`Payor: failed to retreive payor with ein: ${ein}`)
    }
}

export const updatePayorBanking = async (payorId, data) => {
    try {
        const collection = db.collection('payors');
        const query = { _id: payorId }
        const update = {
            $push: {
                "method.accounts": {
                    accountId: data.id,
                    accNum: data.accNum,
                    abaRouting: data.abaRouting,
                }
            }
        }

        const result = await collection.updateOne(query, update);

        console.log(`Payor: updated banking info`)
        return result
    } catch (error) {
        console.log(`Payor: there was an issue updating payor's banking info - ${error}`)
        return false;
    }
}