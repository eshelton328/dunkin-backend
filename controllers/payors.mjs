import { getPayorByEIN, createPayor, updatePayorBanking } from '../db/queries/payors.mjs';
import { createCorporateEntity } from "../api/entities.mjs";
import { createSourceAccount } from "../api/accounts.mjs";
import { findSourceAccount } from '../utils/findSourceAccount.mjs';

export const createGetPayor = async (payor) => {
    let apiCalls = 0
    try {
        let payorRec = await getPayorByEIN(payor.ein);
        if (payorRec) {
            return [payorRec, apiCalls];
        }

        const entity = await createCorporateEntity(payor);
        apiCalls++
        if (!entity) {
            return [false, apiCalls];
        }

        let payorId = await createPayor(payor, entity.id);
        if (!payorId) {
            return [false, apiCalls];
        }

        payorRec = await getPayorByEIN(payor.ein);
        if (payorRec) {
            return [payorRec, apiCalls];
        }

        return [false, apiCalls];
    } catch (error) {
        console.log(`Helper: there was an issue with createGetPayor - ${error}`);
        return [false, apiCalls];
    }
}

export const createGetPayorAccount = async (payor, accNum, abaRouting) => {
    let apiCalls = 0;
    try {
        const payorAccounts = payor.method.accounts;
        const accountId = findSourceAccount(payorAccounts, accNum, abaRouting);
        if (accountId) {
            return [accountId, apiCalls]
        }
        
        const sourceAcc = await createSourceAccount(payor.method.entityId, accNum, abaRouting)
        apiCalls++;
        if (!sourceAcc) {
            return [false, apiCalls];
        }

        const id = sourceAcc.id
        const res = await updatePayorBanking(payor._id, { id, accNum, abaRouting })
        if (!res) {
            return [false, apiCalls];
        }

        return [sourceAcc.id, apiCalls]
    } catch (error) {
        console.log(`Helper: there was an error with createGetPayorAccount - ${error}`)
        return [false, apiCalls];
    }
}