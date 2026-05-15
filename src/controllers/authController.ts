import type { Request, Response } from "express";

export default class AuthController {
  signup(req: Request, res: Response) {
    const userData = req.body;
  }
}
