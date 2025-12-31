const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: String,
    name: String,
    email: String,
    status: String,
    domain: String,
    screenshots: [String],
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
