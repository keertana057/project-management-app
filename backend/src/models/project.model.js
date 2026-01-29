import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["PLANNED", "ONGOING", "COMPLETED", "ARCHIVED"],
      default: "PLANNED",
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    projectManager: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
    },

  },
  { timestamps: true }
  
);

const Project = mongoose.model("Project", projectSchema);
export default Project;



