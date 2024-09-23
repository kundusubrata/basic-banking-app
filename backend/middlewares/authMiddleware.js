import { CustomErrorHandler } from "../utils/customErrorHandler.js";
import { asyncHandler } from "./asyncHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new CustomErrorHandler("Login first to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);
  req.userId = decoded.id;
  next();
})
