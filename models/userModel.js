import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  isRecruiter: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default:
      "https://api-private.atlassian.com/users/3ed7bde5a8c78e8d0d38eca297f62495/avatar",
  },
});

export const User = mongoose.model("Users", userSchema);
