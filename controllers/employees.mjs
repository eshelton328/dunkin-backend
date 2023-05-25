import { getEmployeeByDunkinId, createEmployee, updateEmployeeBanking } from '../db/queries/employees.mjs';
import { createIndividualEntity } from '../api/entities.mjs';
import { createDestinationAccount } from '../api/accounts.mjs';

export const createGetEmployee = async (employee) => {
    let apiCalls = 0
    try {
        let employeeRec = await getEmployeeByDunkinId(employee.dunkinId)
        if (employeeRec) {
            console.log("returning from createGetEmployee")
            return [employeeRec, apiCalls];
        }

        const entity = await createIndividualEntity(employee);
        apiCalls++
        if (!entity) {
            return [false, apiCalls];
        }

        let employeeId = await createEmployee(employee, entity.id)
        if (!employeeId) {
            return [false, apiCalls];
        }

        employeeRec = await getEmployeeByDunkinId(employee.dunkinId)
        if (employeeRec) {
            return [employeeRec, apiCalls];
        }

        return [false, apiCalls];
    } catch (error) {
        console.error(`Helper: there was an error with createGetEmployee - ${error}`)
        return [false, apiCalls];
    }
}

export const createGetEmployeeAccount = async (employee, merchantId, accNum, plaidId) => {
    let apiCalls = 0
    try {
        const employeeAccounts = employee.method.accounts;
        let accountId = false;
        for (const account of employeeAccounts) {
            if (account.accNum === accNum && account.mchId === merchantId) {
                accountId = account.accountId;
                return [accountId, apiCalls];
            }
        }

        const destinationAcc = await createDestinationAccount(employee.method.entityId, merchantId, accNum);
        apiCalls++;
        if (!destinationAcc) {
            return [false, apiCalls];
        }

        const vals = {
            id: destinationAcc.id,
            mchId: merchantId,
            accNum: accNum,
            plaidId: plaidId,
        }

        const res = await updateEmployeeBanking(employee._id, vals);
        if (!res) {
            return [false, apiCalls];
        }

        return [destinationAcc.id, apiCalls];
    } catch (error) {
        console.error(`Helper: there was an error with createGetEmployeeAccount - ${error}`)
        return [false, apiCalls];
    }
}