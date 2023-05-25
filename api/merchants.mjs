import method from './method.mjs'

export const getMerchantPlaid = async (plaidId) => {
    try {
        const merchants = await method.merchants.list({
            "provider_id.plaid": plaidId,
        })

        return merchants[0];
    } catch (error) {
        console.log(error)
        return false;
    }
}