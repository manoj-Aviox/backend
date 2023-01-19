import { Router } from "express";
const router = Router();
import verifyToken from "../middlewares/verifyToken.js";
import user from "../schema/userShcema.js";

// profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userCheckByEmail = await user.findOne({ email: req.user.email });
    if (userCheckByEmail) {
      res.status(200).json(userCheckByEmail);
    } else {
      res.status(400).send({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// profile update
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const userCheckByEmail = await user.findOne({ email: req.user.email });
    if (userCheckByEmail) {
      await user.updateOne(
        { email: req.user.email },
        { $set: { ...req.body } }
      );
      res.status(201).json({ message: "user updated!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
