import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { Account } from "../models/account.model.js";
import { CustomErrorHandler } from "../utils/customErrorHandler.js";

// User balance   ===>>> /api/v1/account/balance
export const getBalance = asyncHandler(async (req, res, next) => {
  const account = await Account.findOne({
    userId: req.userId,
  })
  res.json({
    balance: account.balance,
  })
})

// Transfer money   ===>>> /api/v1/account/transfer
export const sendMoney = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  const { amount, to } = req.body;

  const account = await Account.findOne({ userId: req.userId }).session(session);
  if (!account || account.balance < amount) {
    return next(new CustomErrorHandler("Insufficient balance or Account doesn't exist", 400));
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!toAccount) {
    return next(new CustomErrorHandler("Account doesn't exist", 400));
  }

  await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
  await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

  await session.commitTransaction();

  res.json({
    message: "Transfer Successfull",
  })

})
