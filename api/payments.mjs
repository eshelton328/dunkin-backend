import method from './method.mjs'

export const createPayment = async (amount, source, destination, desc) => {
    try {  
        const payment = await method.payments.create({
            amount: amount,
            source: source,
            destination: destination,
            description: desc,
        });
        
        return payment;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getPayment = async (paymentId) => {
    try {
        const payment = await method.payments.get(paymentId);
        return payment
    } catch (error) {
        console.log(error)
        return false;
    }
}