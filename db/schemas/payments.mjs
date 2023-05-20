import { ObjectId } from 'mongodb';

export const payments = {
    collectionName: 'payments',
    fields: {
        _id: ObjectId,
      employee: {
        _id: ObjectId,
        dunkinId: String,
        firstName: String,
        lastName: String,
      },
      payor: {
        _id: ObjectId,
        dunkinId: String,
        accNum: Number,
      },
      payee: {
        _id: ObjectId,
        accNum: Number,
      },
      amount: Number,
      status: String,
      batch: Number,
      subbatch: Number,
      createdAt: Date,
    }
}