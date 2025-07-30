// Winston logging kutubxonasini yuklaymiz - loglarni boshqarish uchun
import winston from "winston";
// MongoDB bilan integratsiya uchun winston-mongodb paketini yuklaymiz
import "winston-mongodb";
// Loyiha konfiguratsiyasini yuklaymiz - database URL olish uchun
import config from "../../config/index.js";

// O'zbekiston vaqt zonasi bo'yicha timestamp yaratuvchi custom format
const customTime = winston.format((data) => {
    // Joriy vaqtni olamiz
    const date = new Date();
    // Vaqtni Tashkent vaqt zonasiga o'tkazamiz va 24-soatlik formatda yozamiz
    data.timestamp = date.toLocaleString("en-GB", {
        timeZone: "Asia/Tashkent", // O'zbekiston vaqt zonasi
        hour12: false, // 24-soatlik format (AM/PM emas)
    });
    return data;
});

// Winston logger obyektini yaratamiz - barcha loglarni boshqaradi
const logger = winston.createLogger({
    // Transportlar - loglarni qayerga yozishni belgilaydi
    transports: [
        // Faqat error levelidagi loglarni alohida faylga yozadi
        new winston.transports.File({
            filename: "logs/error.log", // Error loglar uchun fayl
            level: "error", // Faqat error va undan yuqori darajali loglar
        }),

        // Barcha darajadagi loglarni bitta faylga yozadi
        new winston.transports.File({
            filename: "logs/combined.log", // Barcha loglar uchun umumiy fayl
        }),

        // Faqat info levelidagi loglarni alohida faylga yozadi
        new winston.transports.File({
            filename: "logs/info.log", // Info loglar uchun fayl
            level: "info", // Info va undan yuqori darajali loglar
        }),

        // MongoDB ga loglarni saqlash uchun transport
        new winston.transports.MongoDB({
            db: config.MONGO_URI, // MongoDB ulanish URL'i
            collection: "errorLogs", // Loglar saqlanadigan collection nomi
            level: "error", // Faqat error loglarni database'ga yozadi
        }),
    ],

    // Log formatini belgilaymiz - qanday ko'rinishda yozilishini
    format: winston.format.combine(
        customTime(), // O'zbekiston vaqti bilan
        winston.format.json() // JSON formatida saqlash
    ),
});

export default logger;
