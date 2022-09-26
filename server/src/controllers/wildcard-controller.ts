import { RequestHandler } from "express";

export const wildcardController: RequestHandler = (req, res) => {
  if (req.headers.accept?.includes("text/html")) {
    res.sendFile("index.html", { root: "../../client/dist" });
  } else {
    res.sendStatus(404);
  }
};
