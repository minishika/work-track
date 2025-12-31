




const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: String,

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "teamleader", "employee"],
      default: "employee",
    },

    // Custom Display ID
    employeeId: { type: String, unique: true, sparse: true },

    status: {
      type: String,
      enum: ["Active", "Moderate", "Inactive"],
      default: "Active",
    },

    // ✅ DOMAIN OPTIONAL
    domain: {
      type: String,
      default: null,
    },

    screenshots: [
      {
        type: String,
      },
    ],

    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

















