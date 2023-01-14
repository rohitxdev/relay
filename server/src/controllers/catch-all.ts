import { RequestHandler } from "express";

export const catchAllController: RequestHandler = (req, res) => {
  if (req.headers.accept === "text/html" || req.headers["sec-fetch-mode"] === "navigate") {
    console.log(req.headers);

    res.sendFile("index.html", { root: "../../client/dist" });
  } else {
    res.sendStatus(404);
  }
};
