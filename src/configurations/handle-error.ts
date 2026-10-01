import z from "zod";
import chalk from "chalk";
import { MongoServerError } from "mongodb";
import { Request, Response, NextFunction } from "express";

export default async (err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof z.ZodError) {
    const err_msg = z.prettifyError(err);
    console.log(chalk.bold.red(z.prettifyError(err)));
    return void res.status(400).send({
      code: 400,
      message: "Validation error",
      details: err_msg
    });
  }
  else if (err instanceof MongoServerError) {
    const { errmsg, message } = err.errorResponse;
    return void res.status(400).send({
      code: 400,
      message: "Database error",
      details: errmsg || message
    });
  }
  else res.status(500).send({
    code: 500,
    message: err.message,
    details: "Internal server error"
  });
}
