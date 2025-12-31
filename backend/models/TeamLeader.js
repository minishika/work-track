
const express = require("express");
const User = require("../models/User");
const { verifyToken, isTeamLeader } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/employees", verifyToken, isTeamLeader, async (req, res) => {
  try {
    const teamLeaderId = req.user._id; // JWT decoded user
    const tl = await User.findById(teamLeaderId);

    if (!tl || tl.role !== "teamleader") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const employees = await User.find({ teamLeader: tl._id }).select(
      "-password"
    );

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

