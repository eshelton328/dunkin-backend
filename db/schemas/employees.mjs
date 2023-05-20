import { ObjectId } from 'mongodb';

export const employees = {
    collectionName: 'employees',
    fields: {
        _id: ObjectId,
        firstName: String,
        lastName: String,
        dob: Date,
        phone: String,
        dunkinId: String,
        dunkinBranch: String,
  }
}