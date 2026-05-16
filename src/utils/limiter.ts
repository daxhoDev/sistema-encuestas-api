import rateLimit from "express-rate-limit";

export default function limiter(isAuth: boolean) {
  return rateLimit({
    windowMs: 1000 * 60,
    limit: isAuth ? 10 : 20,
    message: "Too many request from this IP, please try again later",
  });
}
