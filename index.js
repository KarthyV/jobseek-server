import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import jobsRoute from "./routes/jobsRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;

mongoose
  .connect(URL, { useNewUrlParser: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/jobs", jobsRoute);

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
