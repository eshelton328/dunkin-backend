class ApiCallTracker {
    constructor() {
        if (!ApiCallTracker.instance) {
            this.startTime = new Date();
            this.apiCount = 0;
            this.timeWindow = 60 * 1000;
            this.maxApiCount = 600;
            ApiCallTracker.instance = this;
        }
        return ApiCallTracker.instance;
    }

    async updateApiCount() {
        const now = new Date();
        const timeElapsed = now.getTime() - this.startTime.getTime();

        if (timeElapsed >= this.timeWindow) {
            this.startTime = new Date();
            this.apiCount = 0;
        }

        if (this.apiCount < this.maxApiCount) {
            this.apiCount++;
        } else {
            const waitTime = this.timeWindow - timeElapsed;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            this.startTime = new Date();
            this.apiCount = 1;
        }
    }

    getApiCount() {
        return this.apiCount;
    }
}

const apiCallTracker = new ApiCallTracker();
export default apiCallTracker;
