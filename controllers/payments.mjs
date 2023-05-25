import { createPayment } from "../api/payments.mjs";
import { updatePaymentData } from "../db/queries/payments.mjs";

export const createUpdatePayment = async (paymentId, amount, source, destination, desc) => {
    try {
        const payment = await createPayment(amount, source, destination, desc);
        if (!payment) {
            return false;
        }

        let result = await updatePaymentData(paymentId, payment);
        if (!result) {
            return false;
        }
        return payment.status;
    } catch (error) {
        console.error(`Helper: there was an error with createUpdatePayment - ${error}`)
        return false;
    }
}