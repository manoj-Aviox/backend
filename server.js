import cors from "cors";
import morgan from "morgan";
import express from "express";
import * as dotenv from "dotenv";
import connection from "./database/connection.js";

import auth from "./routes/auth.js";
import user from "./routes/user.js";

dotenv.config();
connection();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.disable("x-powerd-by");

// endpoints
app.use("/auth", auth);
app.use("/user", user);

// routes
app.get("/", (req, res) => {
  res.status(200).send("Hello  World");
});

// start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
