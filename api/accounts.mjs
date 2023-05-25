import method from './method.mjs'

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
        
        return account;
    } catch (error) {
        console.log(error)
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

        return account;
    } catch (error) {
        console.log(error)
        return false;
    }
}