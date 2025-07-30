import { config } from "dotenv";

config();

const appConfig = {
    PORT: Number(process.env.PORT),

    MONGO_URI: process.env.MONGO_URI,

    ADMIN: {
        SUPERADMIN_USERNAME: process.env.SUPERADMIN_USERNAME,
        SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
        SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,
    },

    TOKEN: {
        ACCESS_TOKEN_KEY: String(process.env.ACCESS_TOKEN_KEY),
        ACCESS_TOKEN_TIME: String(process.env.ACCESS_TOKEN_TIME),
        REFRESH_TOKEN_KEY: String(process.env.REFRESH_TOKEN_KEY),
        REFRESH_TOKEN_TIME: String(process.env.REFRESH_TOKEN_TIME),
    },

    MAIL: {
        HOST: process.env.MAIL_HOST,
        PORT: Number(process.env.MAIL_PORT),
        MAIL: process.env.MAIL_USER,
        PASS: process.env.MAIL_PASS,
        USER: process.env.SUPERADMIN_USERNAME || "N23 Marketplace",
    },

    REDIS: {
        HOST: String(process.env.REDIS_HOST),
        PORT: Number(process.env.REDIS_PORT),
    },

    CONFIRM_PASSWORD_URL: String(process.env.CONFIRM_PASSWORD_URL),
};

export default appConfig;
