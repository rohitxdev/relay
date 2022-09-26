import { RequestHandler } from "express";

export const entryPointController: RequestHandler = (req, res) => {
  res.send("*Cricket sounds* ");
};
