import method from './method.mjs'
import apiCallTracker from '../utils/apiTracker.mjs';

export const getMerchantPlaid = async (plaidId) => {
    try {
        const merchants = await method.merchants.list({
            "provider_id.plaid": plaidId,
        })

        apiCallTracker.updateApiCount()

        return merchants[0];
    } catch (error) {
        console.log(error)
        apiCallTracker.updateApiCount()
        return false;
    }
}