import { getEmployeeByDunkinId, createEmployee, updateEmployeeBanking } from '../db/queries/employees.mjs';
import { createIndividualEntity } from '../api/entities.mjs';
import { createDestinationAccount } from '../api/accounts.mjs';

export const createGetEmployee = async (employee) => {
    try {
        let employeeRec = await getEmployeeByDunkinId(employee.dunkinId)
        if (employeeRec) {
            return employeeRec;
        }

        const entity = await createIndividualEntity(employee);
        if (!entity) {
            return false;
        }

        let employeeId = await createEmployee(employee, entity.id)
        if (!employeeId) {
            return false;
        }

        employeeRec = await getEmployeeByDunkinId(employee.dunkinId)
        if (employeeRec) {
            return employeeRec;
        }

        return false;
    } catch (error) {
        console.error(`Helper: there was an error with createGetEmployee - ${error}`)
        return false;
    }
}

export const createGetEmployeeAccount = async (employee, merchantId, accNum, plaidId) => {
    try {
        const employeeAccounts = employee.method.accounts;
        let accountId = false;
        for (const account of employeeAccounts) {
            if (account.accNum === accNum && account.mchId === merchantId) {
                accountId = account.accountId;
                return accountId;
            }
        }

        const destinationAcc = await createDestinationAccount(employee.method.entityId, merchantId, accNum);
        if (!destinationAcc) {
            return false;
        }

        const vals = {
            id: destinationAcc.id,
            mchId: merchantId,
            accNum: accNum,
            plaidId: plaidId,
        }

        const res = await updateEmployeeBanking(employee._id, vals);
        if (!res) {
            return false;
        }

        return destinationAcc.id;
    } catch (error) {
        console.error(`Helper: there was an error with createGetEmployeeAccount - ${error}`)
        return false;
    }
}