import method from './method.mjs'
import apiCallTracker from '../utils/apiTracker.mjs';

export const createSourceAccount = async (holderId, accNum, routingNum) => {
    try {
        const account = await method.accounts.create({
            holder_id: holderId,
            ach: {
                routing: routingNum,
                number: accNum,
                type: 'checking',
            },
        });

        apiCallTracker.updateApiCount()
        
        return account;
    } catch (error) {
        console.log(error)
        apiCallTracker.updateApiCount()
        return false;
    }
}

export const createDestinationAccount = async (holderId, merchantId, accNum) => {
    try {
        const account = await method.accounts.create({
            holder_id: holderId,
            liability: {
                mch_id: merchantId,
                account_number: accNum,
            },
        })

        apiCallTracker.updateApiCount()

        return account;
    } catch (error) {
        console.log(error)
        apiCallTracker.updateApiCount()
        return false;
    }
}