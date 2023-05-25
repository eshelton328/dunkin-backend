import Bull from 'bull';

const queue = new Bull('queue');

queue.empty().then(() => {
    console.log('Queue has been cleared');
});


export default queue;