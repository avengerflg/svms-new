const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
  adminOnly,
  adminAndSecurity,
} = require("../middleware/auth");
const Visitor = require("../models/Visitor");
const User = require("../models/User");

// Admin Dashboard Data
router.get("/admin", authenticateToken, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get today's visitor stats
    const todayVisitors = await Visitor.countDocuments({
      school: req.user.school,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const checkedInVisitors = await Visitor.countDocuments({
      school: req.user.school,
      status: "checked-in",
    });

    const pendingApprovals = await Visitor.countDocuments({
      school: req.user.school,
      status: "pending",
    });

    const totalUsers = await User.countDocuments({
      school: req.user.school,
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        todayVisitors,
        checkedInVisitors,
        pendingApprovals,
        totalUsers,
        userRole: req.user.role,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Security Dashboard Data
router.get(
  "/security",
  authenticateToken,
  adminAndSecurity,
  async (req, res) => {
    try {
      const checkedInVisitors = await Visitor.find({
        school: req.user.school,
        status: "checked-in",
      })
        .populate("approvedBy", "firstName lastName")
        .sort({ checkInTime: -1 })
        .limit(20);

      const overstayVisitors = await Visitor.find({
        school: req.user.school,
        status: "overstay",
      })
        .populate("approvedBy", "firstName lastName")
        .sort({ checkInTime: -1 });

      res.json({
        success: true,
        data: {
          checkedInVisitors,
          overstayVisitors,
          userRole: req.user.role,
        },
      });
    } catch (error) {
      console.error("Security dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Teacher Dashboard Data
router.get(
  "/teacher",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const pendingApprovals = await Visitor.find({
        school: req.user.school,
        status: "pending",
        $or: [
          { personToMeet: { $regex: req.user.userId, $options: "i" } },
          { department: "Teaching Staff" },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(10);

      const recentVisitors = await Visitor.find({
        school: req.user.school,
        approvedBy: req.user.userId,
      })
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        success: true,
        data: {
          pendingApprovals,
          recentVisitors,
          userRole: req.user.role,
        },
      });
    } catch (error) {
      console.error("Teacher dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Front Desk Dashboard Data
router.get(
  "/frontdesk",
  authenticateToken,
  authorizeRoles("frontdesk", "security", "admin"),
  async (req, res) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const todayVisitors = await Visitor.find({
        school: req.user.school,
        createdAt: { $gte: startOfDay },
      })
        .sort({ createdAt: -1 })
        .limit(20);

      const awaitingCheckout = await Visitor.find({
        school: req.user.school,
        status: "checked-in",
      }).sort({ checkInTime: 1 });

      res.json({
        success: true,
        data: {
          todayVisitors,
          awaitingCheckout,
          userRole: req.user.role,
        },
      });
    } catch (error) {
      console.error("Front desk dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
