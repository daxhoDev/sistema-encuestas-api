import type { Request, Response } from "express";
import type { IAuthService } from "../types.js";
import { json } from "../utils/json.js";
import type { Jwt } from "jsonwebtoken";

export default class AuthController {
  constructor(private service: IAuthService) {}

  async signup(req: Request, res: Response) {
    const userData = req.body;
    const { user, token } = await this.service.signup(userData);
    this.sendTokenAndUser(res, user, token);
  }

  async login(req: Request, res: Response) {
    const userData = req.body;
    const { user, token } = await this.service.login(userData);
    this.sendTokenAndUser(res, user, token);
  }

  async logout(req: Request, res: Response) {
    res
      .cookie("jwt", "loggedout", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({ status: "success" });
  }

  sendTokenAndUser(res: Response, user: any, token: string) {
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        expires: new Date(
          Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        ),
      })
      .status(200)
      .type("json")
      .send(
        json({
          status: "success",
          token,
          data: { user },
        }),
      );
  }
}
