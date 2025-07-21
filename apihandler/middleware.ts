import rateLimit from "express-rate-limit";

//rate limitor function to limit the number of requests
export const rateLimitForApp = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests, please try again later.",
});
