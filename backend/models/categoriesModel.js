import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    // Optionally, if each category is created by a user:
    user: {
           type: mongoose.Schema.ObjectId,
           ref: "users",
           required: true,
       },
    name: {
        type: String,
        required: [true, "Please enter Category name"],
        trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("categories", categorySchema);
