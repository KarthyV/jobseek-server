import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  companyName: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now(),
  },
  jobType: {
    type: String,
    required: true,
  },
  location: { type: String, required: true },
  preferredLanguage: [
    {
      type: String,
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

export const Job = mongoose.model("Jobs", jobSchema);
