import { Request, Response } from "express";
export const wildcardController = (req: Request, res: Response) => {
  if (req.headers.accept?.includes("text/html")) {
    res.sendFile("index.html", { root: "../../client/dist" });
  } else {
    res.sendStatus(404);
  }
};
