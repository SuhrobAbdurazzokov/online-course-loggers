import RedisClient from "../db/redis-client.js";

class Redis {
  async setData(key, value, time = 300) {
    return RedisClient.set(key, value, {
      EX: time,
    });
  }

  async getData(key) {
    return RedisClient.get(key);
  }

  async deleteData(key) {
    return RedisClient.del(key);
  }
}

export default new Redis();
