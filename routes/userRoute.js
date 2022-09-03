import { User } from "../models/userModel.js";
import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw new Error("Invalid Credentials");
        if (result) {
          user.password = "";
          return res.status(200).send(user);
        }
      });
    } else return res.status(400).send("Invalid Credentials");
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, checkbox, profilePictureLink } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        isRecruiter: checkbox,
        profilePicture: profilePictureLink,
      });
      await newUser.save();
      newUser.password = "";
      return res.status(201).send(newUser);
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
