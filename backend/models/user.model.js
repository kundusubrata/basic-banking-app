import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
  },
  firstName: {
    type: String,
    requred: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();

  if (update.password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
})


userSchema.methods.validatePassword = async function(userPassword) {
  return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  })
}

export const User = mongoose.model("User", userSchema);

