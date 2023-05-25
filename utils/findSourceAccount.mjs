export const findSourceAccount = (accounts, accNum, abaRouting) => {
    let accountId = false;
    for (const account of accounts) {
        if (account.accNum === accNum && account.abaRouting === abaRouting) {
            accountId = account.accountId
            break;
        }
    }

    return accountId
}