const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },   // what happened
    user: { type: String },                     // who did it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);