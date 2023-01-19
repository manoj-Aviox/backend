import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import user from "../schema/userShcema.js";
import generateOtp from "../services/otp.js";
import sendOtp from "../services/sendOtp.js";

// register
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, mobile } = req.body;
    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !mobile
    ) {
      res.status(400).json({ message: "Please fill all fields" });
    } else {
      const userCheckByUserName = await user.findOne({ username });
      const userCheckByEmail = await user.findOne({ email });

      if (!userCheckByUserName && !userCheckByEmail) {
        await user.create({
          username,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.CRYPTO_SECRET
          ).toString(),
          email,
          firstName,
          lastName,
          mobile,
        });
        res.status(201).json({ message: "user registered!" });
      } else {
        res.status(400).json({
          message: `${userCheckByEmail ? "email" : "username"} already exists!`,
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      res.status(400).json({ message: "Please fill all fields" });
    } else {
      const userCheckByEmail = await user.findOne({ email });
      if (userCheckByEmail) {
        const originalPassword = CryptoJS.AES.decrypt(
          userCheckByEmail.password,
          process.env.CRYPTO_SECRET
        ).toString(CryptoJS.enc.Utf8);
        if (originalPassword == password) {
          const token = jwt.sign(req.body, process.env.JWT_SECRET);
          await user.updateOne(
            { email },
            {
              $set: {
                otp: "",
              },
            }
          );
          res.send({ message: "logged in success!", access_token: token });
        } else {
          res.status(401).json({
            message: `password didn't match!`,
          });
        }
      } else {
        res.status(404).json({
          message: `user not found!`,
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// otp
router.post("/otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).send({ message: "please provide email!" });
    } else {
      const checkUser = await user.findOne({ email });
      if (checkUser) {
        const otp_generated = generateOtp();
        await user.updateOne({ email }, { $set: { otp: otp_generated } });
        sendOtp(email, otp_generated).catch(console.error());
        res.status(200).send({
          message: "otp has been sent to email!",
          otp: otp_generated,
        });
      } else {
        res.send({ message: "Please enter registered email!" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
});

// verify-otp
router.post("/verify_otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      res.status(400).send({ message: "please fill all fields!" });
    } else {
      const checkUser = await user.findOne({ email });
      if (checkUser) {
        if (checkUser.otp == otp) {
          await user.updateOne(
            { email },
            {
              $set: {
                otp: "",
                password: CryptoJS.AES.encrypt(
                  password,
                  process.env.CRYPTO_SECRET
                ).toString(),
              },
            }
          );
          res.status(200).send({
            message: "password updated success!",
          });
        } else {
          res.status(400).send({ message: "please provide correct otp!" });
        }
      } else {
        res.send({ message: "Please enter registered email!" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
});

export default router;
