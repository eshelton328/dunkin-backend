import { ObjectId } from 'mongodb';

export const formatPayments = (payments, batchId) => {
    let result = []
    for (const payment of payments) {
        const { employee, payor, payee, amount } = payment;
        const amountNum = parseFloat(amount.replace('$', ''));
        const vals = {
            _id: new ObjectId(),
            employee: {
                firstName: employee.firstName,
                lastName: employee.lastName,
                dob: employee.dob,
                dunkinId: employee.dunkinId,
                dunkinBranch: employee.dunkinBranch,
            },
            payor: {
                name: payor.name,
                dba: payor.dba,
                ein: payor.ein,
                address: {
                    street: payor.address.street,
                    city: payor.address.city,
                    state: payor.address.state,
                    zip: payor.address.zip,
                },
                banking: {
                    abaRouting: payor.abaRouting,
                    accNum: payor.accNum
                },
                dunkinId: payor.dunkinId,
            },
            payee: {
                accNum: payee.loanAccNum,
                plaidId: payee.plaidId,
            },
            batch: {
                _id: batchId,
            },
            amount: amountNum,
            status: 'queued',
            createdAt: new Date(),
        }
        result.push(vals)
    }

    return result;
}