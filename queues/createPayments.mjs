import { formatPayments } from "../utils/formatPayments.mjs";
import { createPayments } from "../db/queries/payments.mjs";

export const createPaymentsQueue = async (data) => {
    const { payments, batchId } = data;
    const vals = formatPayments(payments, batchId)
    const res = await createPayments(vals)
    if (!res) {
        console.error("Error: there was an error with createPaymentsQueue")
    }
};