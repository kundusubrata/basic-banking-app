
import express from "express";
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";
import { getBalance, sendMoney } from "../controllers/account.controller.js";

const accountRouter = express.Router();

accountRouter.route('/balance').get(isAuthenticatedUser, getBalance);
accountRouter.route('/transfer').post(isAuthenticatedUser, sendMoney);

export {
  accountRouter,
}
