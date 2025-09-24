const express = require("express");
const router = express.Router();
const VisitorController = require("../controllers/visitorController");

router.post("/", VisitorController.createVisitor);
router.get("/", VisitorController.getVisitors);
router.get("/:id", VisitorController.getVisitorById);
router.put("/:id", VisitorController.updateVisitor);
router.delete("/:id", VisitorController.deleteVisitor);

module.exports = router;
