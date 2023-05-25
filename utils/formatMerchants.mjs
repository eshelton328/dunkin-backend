import { ObjectId } from "mongodb";

export const formatMerchants = (merchants) => {
    let result = [];
    for (const merchant of merchants) {
        const vals = {
            _id: new ObjectId(),
            mchId: merchant.mch_id,
            parentName: merchant.parent_name,
            name: merchant.name,
            logo: merchant.logo,
            description: merchant.description,
            note: merchant.note,
            types: merchant.types,
            accountPrefixes: merchant.account_prefixes,
            providerIds: merchant.provider_ids,
            credentials: merchant.credentials,
            customizedAuth: merchant.customized_auth,
            isTemp: merchant.is_temp,
            accountNumberFormats: merchant.account_number_formats,
        }
        result.push(vals)
    }

    return result;
}