import { createPayment } from "../api/payments.mjs";
import { updatePaymentData } from "../db/queries/payments.mjs";

export const createUpdatePayment = async (paymentId, amount, source, destination, desc) => {
    let apiCalls = 0
    try {
        const payment = await createPayment(amount, source, destination, desc);
        apiCalls++
        if (!payment) {
            return [false, apiCalls];
        }

        // update payment
        let result = await updatePaymentData(paymentId, payment);
        if (!result) {
            return [false, apiCalls]
        }
        return [payment.status, apiCalls];
    } catch (error) {
        console.error(`Helper: there was an error with createUpdatePayment - ${error}`)
        return [false, apiCalls];
    }
}