const express = require("express");
const router = express.Router();
const VisitorController = require("../controllers/visitorController");
const { authenticateToken } = require("../middleware/auth");

// Visitor CRUD operations
router.post("/", authenticateToken, VisitorController.createVisitor);
router.get("/", authenticateToken, VisitorController.getVisitors);
router.get("/history", authenticateToken, VisitorController.getVisitorHistory);
router.get("/:id", authenticateToken, VisitorController.getVisitorById);
router.put("/:id", authenticateToken, VisitorController.updateVisitor);
router.delete("/:id", authenticateToken, VisitorController.deleteVisitor);

// Visitor status management
router.post(
  "/:id/checkin",
  authenticateToken,
  VisitorController.checkInVisitor
);
router.post(
  "/:id/checkout",
  authenticateToken,
  VisitorController.checkOutVisitor
);
router.post(
  "/:id/approve",
  authenticateToken,
  VisitorController.approveVisitor
);
router.post("/:id/reject", authenticateToken, VisitorController.rejectVisitor);

module.exports = router;
