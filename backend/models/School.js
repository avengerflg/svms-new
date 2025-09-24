const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "India" },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    settings: {
      visitingHours: {
        start: { type: String, default: "08:00" },
        end: { type: String, default: "17:00" },
      },
      maxVisitDuration: { type: Number, default: 120 }, // minutes
      requireApproval: { type: Boolean, default: true },
      allowSelfRegistration: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("School", schoolSchema);
