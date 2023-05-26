import Bull from 'bull';

const queue = new Bull('queue');

// uncomment and restart server to clear queue
// queue.obliterate({ force: true });

export default queue;