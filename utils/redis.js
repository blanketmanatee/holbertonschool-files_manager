class RedisClient {
    constructor () {
        this.client = redis.createClient();

        this.getAsync = promisify(this.client.get).bind(this.client);

        this.client.on('error', (error) => {
            console.log(`Redis client not connected to the server: ${error.message}`);
        });
    }
}