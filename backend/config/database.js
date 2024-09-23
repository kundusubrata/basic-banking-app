
import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose.connect(process.env.DB_URL).then((con) => {
    console.log(`Mongodb Database connected with Host: ${con?.connection?.host}`)
  })
}
