const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    idType: {
      type: String,
      enum: ["passport", "drivers-license", "national-id", "employee-id", "student-id"],
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
      trim: true,
    },
    visitorCategory:{
    type: String,
    enum: [
      "parent",
      "contractor",
      "vendor",
      "guest",
      "alumni",
      "official",
      "media",
      "other",
    ],
    required: true,
    },
    purposeOfVisit: {
      type: String,
      trim: true,
    },
    personToMeet: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      enum: [
      "administration",
      "academics",
      "student-affairs",
      "facilities",
      "it",
      "library",
      "security",
      "cafeteria",
    ],
      required: true,
    },
    expectedDuration: {
      type: Number, // minutes
      default: 60,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    vehicleNumber: {
      type: String,
      trim: true,
    },
    specialRequirements: {
      type: String,
      trim: true,
    },
    photo: {
      type: String, // file path
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String, // QR code data
    },
    badgeNumber: {
      type: String,
      unique: true,
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate badge number
visitorSchema.pre("save", async function (next) {
  if (this.isNew && !this.badgeNumber) {
    const count = await mongoose.model("Visitor").countDocuments();
    this.badgeNumber = `V${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model("Visitor", visitorSchema);
