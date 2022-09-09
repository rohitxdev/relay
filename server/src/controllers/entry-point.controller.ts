import { Request, Response } from "express";

export const entryPointController = (req: Request, res: Response) => {
  res.send("*Cricket sounds* ");
};
