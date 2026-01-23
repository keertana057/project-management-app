import mongoose from "mongoose";

const projectTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    tasks: [
      {
        title: {
          type: String,
          required: true,
        },
        priority: {
          type: String,
          enum: ["LOW", "MEDIUM", "HIGH"],
          default: "MEDIUM",
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProjectTemplate", projectTemplateSchema);
