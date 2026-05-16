import type { Request, Response } from "express";
import type { IAuthService } from "../types.js";
import { json } from "../utils/json.js";

export default class AuthController {
  constructor(private service: IAuthService) {}

  async signup(req: Request, res: Response) {
    const userData = req.body;
    const result = await this.service.signup(userData);

    res
      .cookie("token", result.token, { httpOnly: true })
      .status(200)
      .type("json")
      .send(
        json({
          status: "success",
          data: result.user,
        }),
      );
  }

  async login(req: Request, res: Response) {
    const userData = req.body;
    const token = await this.service.login(userData);

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .type("json")
      .send(
        json({
          status: "success",
          data: token,
        }),
      );
  }
}
