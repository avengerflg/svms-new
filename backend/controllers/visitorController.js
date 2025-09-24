const Visitor = require("../models/Visitor");
const QRCode = require("qrcode");

// Create new visitor
exports.createVisitor = async (req, res) => {
  try {
    const visitorData = req.body;

    // Generate QR code for visitor (store as string or base64)
    const qrCode = await QRCode.toDataURL(visitorData.email + Date.now());
    visitorData.qrCode = qrCode;

    const visitor = new Visitor(visitorData);
    await visitor.save();

    res.status(201).json({
      success: true,
      message: "Visitor registered successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Error creating visitor:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all visitors
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate("school").populate("approvedBy");
    res.json({ success: true, data: visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate("school")
      .populate("approvedBy");

    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }

    res.json({ success: true, data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update visitor (approve, check-in, check-out, etc.)
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }

    res.json({ success: true, message: "Visitor updated successfully", data: visitor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }

    res.json({ success: true, message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
