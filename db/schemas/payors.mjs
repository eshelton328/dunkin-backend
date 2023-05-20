import { ObjectId } from 'mongodb';

export const payors = {
    collectionName: 'payors',
    fields: {
        _id: ObjectId,
        name: String,
        dba: String,
        ein: String,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
        },
        banking: {
            abaRouting: Number,
            accNum: Number,
        },
        dunkinId: String,
    }
}