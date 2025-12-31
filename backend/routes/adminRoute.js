



const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/teamleader", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, domain } = req.body;

    if (!name || !email || !password || !domain) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const count = await User.countDocuments({ role: "teamleader" });
    const employeeId = "TL" + String(count + 1).padStart(3, "0");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teamleader",
      domain,
      employeeId,
      status: "Active",
    });

    res.status(201).json({ message: "Team Leader created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/employee", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, domain } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const count = await User.countDocuments({ role: "employee" });
    const employeeId = "EMP" + String(count + 1).padStart(3, "0");

    let teamLeader = null;
    if (domain) {
      teamLeader = await User.findOne({ role: "teamleader", domain });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "employee",
      domain: domain || null,
      employeeId,
      teamLeader: teamLeader ? teamLeader._id : null,
      status: "Active",
    });

    res.status(201).json({ message: "Employee created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/employee/assign", verifyToken, isAdmin, async (req, res) => {
  try {
    const { employeeId, teamLeaderId } = req.body;

    const teamLeader = await User.findById(teamLeaderId);
    if (!teamLeader || teamLeader.role !== "teamleader") {
      return res.status(404).json({ message: "Team Leader not found" });
    }

    const employee = await User.findByIdAndUpdate(
      employeeId,
      {
        teamLeader: teamLeader._id,
        domain: teamLeader.domain,
      },
      { new: true }
    );

    res.json({ message: "Assigned successfully", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find()
    .select("-password")
    .populate("teamLeader", "name employeeId domain");

  res.json(users);
});

router.delete(
  "/employee/:id/screenshot",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { screenshotUrl } = req.body;

      if (!screenshotUrl) {
        return res.status(400).json({ message: "Screenshot URL required" });
      }

      const employee = await User.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // ⭐ Normalize function
      const normalize = (url) => url.replace(/\\/g, "/");

      const beforeCount = employee.screenshots.length;

      // ⭐ Manual delete
      employee.screenshots = employee.screenshots.filter(
        (url) => normalize(url) !== normalize(screenshotUrl)
      );

      const afterCount = employee.screenshots.length;

      // ❌ Nothing deleted
      if (beforeCount === afterCount) {
        return res.status(404).json({
          message: "Screenshot not found (URL mismatch)",
          screenshots: employee.screenshots,
        });
      }

      await employee.save();

      res.json({
        message: "Screenshot deleted successfully",
        screenshots: employee.screenshots,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ ASSIGN TEAM LEADER TO EMPLOYEE
router.put(
  "/employee/assign-teamleader",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { employeeId, teamLeaderId } = req.body;

      if (!employeeId || !teamLeaderId) {
        return res.status(400).json({ message: "employeeId and teamLeaderId required" });
      }

      // Check team leader
      const teamLeader = await User.findById(teamLeaderId);
      if (!teamLeader || teamLeader.role !== "teamleader") {
        return res.status(404).json({ message: "Team leader not found" });
      }

      // Assign team leader to employee
      const employee = await User.findByIdAndUpdate(
        employeeId,
        {
          teamLeader: teamLeader._id,
          domain: teamLeader.domain,
        },
        { new: true }
      );

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json({
        message: "Team leader assigned successfully",
        employee,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Promote Employee to Team Leader
router.put(
  "/admin/employee/assign-teamleader",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { employeeId } = req.body;

      // Find the employee
      const employee = await User.findById(employeeId);
      if (!employee || employee.role !== "employee") {
        return res.status(404).json({ message: "Employee not found or already a team leader" });
      }

      // Promote to teamleader
      employee.role = "teamleader";
      employee.id = "TL" + String(await User.countDocuments({ role: "teamleader" }) + 1).padStart(3, "0");
      await employee.save();

      res.json({ message: "Employee promoted to Team Leader successfully", employee });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


module.exports = router;









