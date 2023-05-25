import { Method, Environments } from 'method-node';

const METHOD_KEY = process.env.METHOD_KEY || "";

const method = new Method({
    apiKey: METHOD_KEY,
    env: Environments.dev,
});

export default method;