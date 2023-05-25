export const rateLimit = async (count, startTime) => {
    const currentTime = new Date();
    const endTime = new Date(startTime);
    const duration = currentTime - endTime;

    if (duration >= 60000) {
        count = 0
        startTime = new Date()
    }

    if (count === 600) {

        const remainingTime = 600000 - (currentTime - startTime);
        const waitTime = remainingTime * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        count = 0
        startTime = new Date()
    }

    return [count, startTime];
}