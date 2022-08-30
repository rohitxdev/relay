import { Request } from "express";

export const bodyParser = (req: Request) => {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";
    req.on("data", (data) => {
      buffer += data;
    });
    req.on("end", () => {
      resolve(buffer);
    });
    req.on("error", (error) => {
      reject(error);
    });
  });
};
