import { asyncHandler } from "../middlewares/asyncHandler.js";
import zod from "zod";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { CustomErrorHandler } from "../utils/customErrorHandler.js";
import { SendToken } from "../utils/sendToken.js";
import { Account } from "../models/account.model.js";

const signUpBody = zod.object({
  username: zod.string().trim().toLowerCase().min(3).max(30),
  password: zod.string().min(3),
  firstName: zod.string().max(50),
  lastName: zod.string().max(50),
})
// Register new user  ===>>>> /api/v1/user/signup
export const signUpUser = asyncHandler(async (req, res, next) => {
  const { success } = signUpBody.safeParse(req.body);

  if (!success) {
    // res.status(411).json({
    //   message: "Incorrect Inputs",
    // })
    return next(new CustomErrorHandler("Incorrect Inputs", 411));
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  })

  if (existingUser) {
    // return res.status(411).json({
    //   message: "Email already exists",
    // })
    return next(new CustomErrorHandler("User already exist", 411));
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  })

  // const userId = user._id;
  // const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  //
  // res.json({
  //   message: "User Created Successfulyy",
  //   token: token,
  // })
  await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 1000,
  })
  SendToken(user, 201, res);
});


const signInBody = zod.object({
  username: zod.string().trim().toLowerCase().min(3).max(30),
  password: zod.string().min(3),
});

// Login User  ===>>> /api/v1/user/signIn 
export const signInUser = asyncHandler(async (req, res, next) => {
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    // res.status(411).json({
    //   message: "Incorrect Inputs",
    // })
    return next(new CustomErrorHandler("Incorrect Inputs", 411));
  }

  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user || !(await user.validatePassword(req.body.password))) {
    // res.status(411).json({
    //   message: "Invalid Username or Password",
    // })
    return next(new CustomErrorHandler("Invalid Username or Password", 411));
  }
  //
  // const isPasswordMatched = await user.validatePassword(req.body.password);
  //
  // if (!isPasswordMatched) {
  //   res.status(411).json({
  //     message: "Wrong Password",
  //   })
  // }

  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  //
  // res.status(200).json({
  //   message: "User logged in",
  //   token: token,
  // })
  SendToken(user, 200, res);
})

const updateBody = zod.object({
  password: zod.string().min(3).optional(),
  firstName: zod.string().max(50).optional(),
  lastName: zod.string().max(50).optional(),

})

//  Update user  ===>>>> /api/v1/user/Update
export const updateUser = asyncHandler(async (req, res, next) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return next(new CustomErrorHandler("Incorrect inputs", 411));
  }

  const updatedUser = await User.findOneAndUpdate({ _id: req.userId }, req.body, { new: true, runValidators: true });

  res.status(200).json({
    message: "Update Successfuly",
    user: updatedUser,
  })
})

// User can search thier friend and send money   ====>>> ap1/v1/user/search
export const searchUser = asyncHandler(async (req, res, next) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [{
      firstName: {
        "$regex": filter
      }
    },
    {
      lastName: {
        "$regex": filter
      },
    }]
  })

  res.json({
    user: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    }))
  })
})
