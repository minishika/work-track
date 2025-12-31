const User = require("../models/User");


exports.getTeamLeaders = async (req, res) => {
  try {
    const teamLeaders = await User.find({ role: "teamleader" }).select(
      "-password"
    );
    res.json(teamLeaders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getEmployeesByTeamLeader = async (req, res) => {
  try {
    const { teamLeaderId } = req.params;

    const employees = await User.find({
      role: "employee",
      teamLeaderId: teamLeaderId,
    }).select("-password");

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.delete(
  "/admin/employee/:id/screenshot",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { screenshotUrl } = req.body;

      if (!screenshotUrl) {
        return res.status(400).json({ message: "Screenshot URL required" });
      }

      const employee = await User.findByIdAndUpdate(
        req.params.id,
        { $pull: { screenshots: screenshotUrl } },
        { new: true }
      );

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json({
        message: "Screenshot deleted successfully",
        screenshots: employee.screenshots,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);
