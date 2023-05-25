import method from './method.mjs'
import apiCallTracker from '../utils/apiTracker.mjs';

export const createPayment = async (amount, source, destination, desc) => {
    try {  
        const payment = await method.payments.create({
            amount: amount,
            source: source,
            destination: destination,
            description: desc,
        });

        apiCallTracker.updateApiCount()
        
        return payment;
    } catch (error) {
        console.log(error)
        apiCallTracker.updateApiCount()
        return false;
    }
}

export const getPayment = async (paymentId) => {
    try {
        const payment = await method.payments.get(paymentId);
        
        apiCallTracker.updateApiCount()

        return payment
    } catch (error) {
        console.log(error)
        apiCallTracker.updateApiCount()
        return false;
    }
}