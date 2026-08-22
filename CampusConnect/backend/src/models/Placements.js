import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Job Drive"],
      default: "Full-time",
    },
    description: {
      type: String,
      default: "",
    },
    package: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    eligibility: {
      type: String,
      default: "",
    },
    deadline: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Open", "Upcoming", "Closed"],
      default: "Open",
    },
    applicants: [{ type: String }], // store user IDs (or temp names)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
