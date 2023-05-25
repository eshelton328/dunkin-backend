export const findMerchant = (array, plaidId) => {
    for (const obj of array) {
        if (obj.provider_ids && obj.provider_ids.plaid && obj.provider_ids.plaid.includes(plaidId)) {
            return obj;
        }
    }
    return false;
}