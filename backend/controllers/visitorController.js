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
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      department,
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { idNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.visitorCategory = category;
    if (status) query.status = status;
    if (department) query.department = department;

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "school", select: "name" },
        { path: "approvedBy", select: "firstName lastName email" },
      ],
    };

    const visitors = await Visitor.paginate(query, options);

    res.json({
      success: true,
      data: visitors.docs,
      pagination: {
        total: visitors.totalDocs,
        pages: visitors.totalPages,
        page: visitors.page,
        limit: visitors.limit,
      },
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    res.json({
      success: true,
      message: "Visitor updated successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    res.json({ success: true, message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check in visitor
exports.checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    if (visitor.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Visitor must be approved before check-in",
      });
    }

    visitor.status = "checked-in";
    visitor.checkInTime = new Date();
    await visitor.save();

    res.json({
      success: true,
      message: "Visitor checked in successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check out visitor
exports.checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    if (visitor.status !== "checked-in") {
      return res.status(400).json({
        success: false,
        message: "Visitor must be checked in before check-out",
      });
    }

    visitor.status = "checked-out";
    visitor.checkOutTime = new Date();
    await visitor.save();

    res.json({
      success: true,
      message: "Visitor checked out successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve visitor
exports.approveVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    visitor.status = "approved";
    visitor.approvedBy = req.user.id;
    visitor.approvalDate = new Date();
    await visitor.save();

    res.json({
      success: true,
      message: "Visitor approved successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject visitor
exports.rejectVisitor = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    visitor.status = "rejected";
    visitor.rejectionReason = rejectionReason;
    await visitor.save();

    res.json({
      success: true,
      message: "Visitor rejected successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get visitor history/analytics
exports.getVisitorHistory = async (req, res) => {
  try {
    const { startDate, endDate, visitorId, department } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.visitDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (visitorId) query._id = visitorId;
    if (department) query.department = department;

    const visitors = await Visitor.find(query)
      .populate("school", "name")
      .populate("approvedBy", "firstName lastName")
      .sort({ visitDate: -1 });

    res.json({ success: true, data: visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
