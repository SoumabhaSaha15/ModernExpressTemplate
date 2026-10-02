import morgan from "morgan";
import express from "express";
import userRouter from "#/router/user/index";

const router = express.Router();

router
.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
.use(userRouter);

export default router;
