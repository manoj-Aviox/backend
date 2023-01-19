import mongoose from "mongoose";

const connection = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_URI, {}, () => {
    console.log("Database connected");
  });
};

export default connection;
