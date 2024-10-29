import { NextFunction, Request, Response } from "express";

const timeMiddleware = (
  _request: Request,
  _response: Response,
  next: NextFunction,
) => {
  console.log(`Time: ${new Date()}`);

  //comment
  next();
};

export { timeMiddleware };
