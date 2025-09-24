const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  status: { type: String, enum: ['invited', 'accepted', 'declined', 'tentative'] },
  required: Boolean
});

const visitorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  organization: String
});

const locationSchema = new mongoose.Schema({
  type: { type: String, enum: ['room', 'office', 'virtual', 'external'] },
  name: String,
  address: String,
  virtualLink: String,
  capacity: Number
});

const reminderSchema = new mongoose.Schema({
  time: Number, // minutes before
  method: { type: String, enum: ['email', 'notification', 'sms'] }
});

const recurrenceSchema = new mongoose.Schema({
  type: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  interval: Number,
  endDate: Date,
  occurrences: Number
});

const appointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['meeting','interview','conference','consultation','training','other'], default: 'meeting' },
  status: { type: String, enum: ['scheduled','confirmed','completed','cancelled','rescheduled'], default: 'scheduled' },
  priority: { type: String, enum: ['low','medium','high','urgent'], default: 'medium' },
  organizer: {
    id: String,
    name: String,
    email: String,
    department: String
  },
  attendees: [attendeeSchema],
  visitors: [visitorSchema],
  startTime: Date,
  endTime: Date,
  duration: Number,
  location: locationSchema,
  recurrence: recurrenceSchema,
  resources: [String],
  reminders: [reminderSchema],
  notes: String,
  attachments: [String],
  isPrivate: Boolean,
  requiresApproval: Boolean,
  approvalStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
