import { Job } from "../models/jobModel.js";
import { User } from "../models/userModel.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const Jobs = await Job.find();
    return res.status(200).send(Jobs);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    await Job.aggregate([
      {
        $match: { _id: objectId },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { _id: 0, name: 1, email: 1 } }],
        },
      },
    ])
      .exec()
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { values } = req.body;
    console.log(values);
    const response = await Job.findByIdAndUpdate({ _id: id }, values, {
      new: true,
      upsert: true,
    });
    if (response) {
      console.log(response);
      res.status(200).send("Job Details Updated successfully");
    } else {
      throw err;
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Job.findByIdAndDelete({ _id: id });
    if (response) {
      const Jobs = await Job.find();
      return res.status(200).send(Jobs);
    } else {
      throw err;
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      jobType,
      location,
      preferredLanguage,
      companyLogo,
      companyName,
      user_id,
    } = req.body.values;
    const newJob = new Job({
      title,
      description,
      jobType,
      location,
      preferredLanguage,
      companyLogo,
      companyName,
      user_id,
    });

    await newJob.save();
    const Jobs = await Job.find();
    return res.status(201).send(Jobs);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/manage-jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const Jobs = await Job.find({ user_id: id });

    return res.status(200).send(Jobs);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/search/:query", async (req, res) => {
  try {
    const Jobs = await Job.find();
    const { query } = req.params;
    const searchResults = Jobs.map((job) => {
      for (let i = 0; i < job.preferredLanguage.length; i++) {
        job.preferredLanguage[i] = job.preferredLanguage[i].toLowerCase();
      }
      return job;
    }).filter((job) => {
      for (let i = 0; i < job.preferredLanguage.length; i++) {
        if (job.preferredLanguage[i].includes(query)) return job;
      }
    });

    return res.status(200).send(searchResults);
  } catch (error) {
    console.log(error);
  }
});

export default router;
