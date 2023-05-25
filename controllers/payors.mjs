import { getPayorByEIN, createPayor, updatePayorBanking } from '../db/queries/payors.mjs';
import { createCorporateEntity } from "../api/entities.mjs";
import { createSourceAccount } from "../api/accounts.mjs";
import { findSourceAccount } from '../utils/findSourceAccount.mjs';

export const createGetPayor = async (payor) => {
    try {
        let payorRec = await getPayorByEIN(payor.ein);
        if (payorRec) {
            return payorRec;
        }

        const entity = await createCorporateEntity(payor);
        if (!entity) {
            return false;
        }

        let payorId = await createPayor(payor, entity.id);
        if (!payorId) {
            return false;
        }

        payorRec = await getPayorByEIN(payor.ein);
        if (payorRec) {
            return payorRec;
        }

        return false;
    } catch (error) {
        console.log(`Helper: there was an issue with createGetPayor - ${error}`);
        return false;
    }
}

export const createGetPayorAccount = async (payor, accNum, abaRouting) => {
    try {
        const payorAccounts = payor.method.accounts;
        const accountId = findSourceAccount(payorAccounts, accNum, abaRouting);
        if (accountId) {
            return accountId;
        }
        
        const sourceAcc = await createSourceAccount(payor.method.entityId, accNum, abaRouting)
        if (!sourceAcc) {
            return false;
        }

        const id = sourceAcc.id
        const res = await updatePayorBanking(payor._id, { id, accNum, abaRouting })
        if (!res) {
            return false;
        }

        return sourceAcc.id;
    } catch (error) {
        console.log(`Helper: there was an error with createGetPayorAccount - ${error}`)
        return false;
    }
}