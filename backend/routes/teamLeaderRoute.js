




const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware"); 
const router = express.Router();


router.get("/teamleader/:id/employees", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;

    
    if (loggedInUser.role !== "admin" && loggedInUser._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const employees = await User.find({
      role: "employee",
      teamLeader: req.params.id,
    }).select("-password");

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
