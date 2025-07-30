import { createClient } from "redis";
import config from "../config/index.js";

const redisClient = createClient({
  socket: {
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
  },
});

redisClient.on("error", (err) =>
  console.log("Error onconnecting to Redis: ", err)
);

await redisClient.connect();

export default redisClient;
