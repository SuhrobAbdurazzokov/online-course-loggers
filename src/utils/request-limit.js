import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const requestLimit = (time, limit) => {
  const limiter = rateLimit({
    windowMs: time * 60 * 1000,
    limit,
    keyGenerator: (req, _) => {
      return (
        ipKeyGenerator(req.ip) || (req.body.username ?? req.body.phoneNumber)
      );
    },

    message: {
      status: 429,
      message: "Too many requests",
    },

    legacyHeaders: true,
    standardHeaders: "draft-6" || "draft-7" || "draft-8",
  });

  return limiter;
};
