import { ObjectId } from 'mongodb';

export const payees = {
    collectionName: 'payees',
    fields: {
        _id: ObjectId,
        plaidId: String,
        accNum: Number,
    }
}