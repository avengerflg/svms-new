const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const School = require("../models/School");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await School.deleteMany({});

    // Create a default school
    const school = new School({
      name: "Demo High School",
      address: {
        street: "123 Education Street",
        city: "Demo City",
        state: "Demo State",
        zipCode: "12345",
        country: "India",
      },
      contact: {
        phone: "+91-9876543210",
        email: "admin@demohighschool.edu",
        website: "https://demohighschool.edu",
      },
      settings: {
        visitingHours: {
          start: "08:00",
          end: "17:00",
        },
        maxVisitDuration: 120,
        requireApproval: true,
        allowSelfRegistration: false,
      },
    });

    await school.save();
    console.log("School created:", school.name);

    // Create users with different roles
    const users = [
      {
        email: "admin@school.com",
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        phone: "+91-9876543210",
        school: school._id,
      },
      {
        email: "security@school.com",
        password: await bcrypt.hash("security123", 12),
        role: "security",
        firstName: "Security",
        lastName: "Officer",
        phone: "+91-9876543211",
        school: school._id,
      },
      {
        email: "frontdesk@school.com",
        password: await bcrypt.hash("frontdesk123", 12),
        role: "frontdesk",
        firstName: "Front Desk",
        lastName: "Staff",
        phone: "+91-9876543212",
        school: school._id,
      },
      {
        email: "teacher@school.com",
        password: await bcrypt.hash("teacher123", 12),
        role: "teacher",
        firstName: "John",
        lastName: "Teacher",
        phone: "+91-9876543213",
        school: school._id,
      },
    ];

    await User.insertMany(users);
    console.log("Users created successfully");

    console.log("\n=== SEED DATA CREATED ===");
    console.log("School:", school.name);
    console.log("\nLogin Credentials:");
    console.log("Admin: admin@school.com / admin123");
    console.log("Security: security@school.com / security123");
    console.log("Front Desk: frontdesk@school.com / frontdesk123");
    console.log("Teacher: teacher@school.com / teacher123");

    process.exit(0);
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

seedDatabase();
