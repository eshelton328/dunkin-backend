import { ObjectId } from 'mongodb';
import db from "../conn.mjs";

export const createEmployee = async (data, entityId) => {
    try {
        const collection = db.collection('employees')
    
        const employee = {
            _id: new ObjectId(),
            fistName: data.firstName,
            lastName: data.lastName,
            dob: data.dob,
            phone: data.phone,
            dunkinId: data.dunkinId,
            dunkinBranch: data.dunkinBranch,
            method: {
                entityId: entityId,
                accounts: [],
            },
            createdAt: new Date(),
        }
    
        const result = await collection.insertOne(employee);
        
        console.log(`Employee: created employee with id: ${result.insertedId}`)
        return result.insertedId;
    } catch (error) {
        console.error(`Employee: there was an error with 'createEmployee': ${error}`)
        return false;
    }
}

export const getEmployeeByDunkinId = async (dunkinId) => {
    try {
        const collection = db.collection('employees');
    
        const query = { dunkinId: dunkinId };

        const result = await collection.findOne(query);
        if (!result) {
            console.log(`Employee: did not find employee with dunkinId: ${dunkinId}`)
            return false
        }
    
        console.log(`Employee: retreived employee with dunkinId: ${dunkinId}`)
        return result
    } catch (error) {
        console.error(`Employee: there was an error retrieving employee with dunkinId: ${dunkinId}`);
        return false;
    }
}

export const updateEmployeeBanking = async (employeeId, data) => {
    try {
        const collection = db.collection('employees');
        const query = { _id: employeeId }
        const update = {
            $push: {
                "method.accounts": {
                    mchId: data.mchId,
                    accountId: data.id,
                    accNum: data.accNum,
                    plaidId: data.plaidId
                }
            }
        }

        const result = await collection.updateOne(query, update);

        console.log("Employee: updating employee banking info")
        return result;
    } catch (error) {
        console.error(`Employee: there was an error updating employee's bankingInfo: ${error}`);
        return false;
    }
}
