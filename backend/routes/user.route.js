import express from "express";
import { searchUser, signInUser, signUpUser, updateUser } from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.route('/signup').post(signUpUser);
userRouter.route('/signin').post(signInUser);
userRouter.route('/update').put(isAuthenticatedUser, updateUser);
userRouter.route('/search').get(searchUser);

export {
  userRouter,
}

