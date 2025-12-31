


const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
  "/employee/upload-screenshot/:id",
  verifyToken,
  isAdmin,
  upload.array("screenshots", 10),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Employee not found" });

      const files = req.files.map(
        (f) => `http://localhost:5000/uploads/${f.filename}`
      );

      user.screenshots.push(...files);
      await user.save();

      res.json({ message: "Uploaded", screenshots: user.screenshots });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;



