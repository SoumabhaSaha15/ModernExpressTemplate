import { Router } from "express";
import userRouter from "#/router/user/get";

const router = Router();
router
  .route('/user')
  .get(userRouter);

export default router;
