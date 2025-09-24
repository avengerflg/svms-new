const Appointment = require('../models/Appointment');

// GET all appointments with filters
exports.getAppointments = async (req, res) => {
  try {
    const { status, type, priority, timeRange, organizer, search } = req.query;
    const now = new Date();

    let filter = {};

    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (priority && priority !== 'all') filter.priority = priority;
    if (organizer && organizer !== 'all') filter['organizer.id'] = organizer;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'organizer.name': { $regex: search, $options: 'i' } },
        { 'location.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (timeRange && timeRange !== 'all') {
      switch (timeRange) {
        case 'today':
          filter.startTime = {
            $gte: new Date(now.setHours(0,0,0,0)),
            $lt: new Date(now.setHours(23,59,59,999)),
          };
          break;
        case 'upcoming':
          filter.startTime = { $gte: now };
          break;
        case 'week':
          filter.startTime = { $gte: now, $lte: new Date(now.getTime() + 7*24*60*60*1000) };
          break;
        case 'month':
          filter.startTime = { $gte: now, $lte: new Date(now.getTime() + 30*24*60*60*1000) };
          break;
        case 'past':
          filter.startTime = { $lt: now };
          break;
      }
    }

    const appointments = await Appointment.find(filter).sort({ startTime: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const data = req.body;
    data.duration = (new Date(data.endTime) - new Date(data.startTime)) / (1000*60);
    const appointment = await Appointment.create(data);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE appointment
exports.updateAppointment = async (req, res) => {
  try {
    const data = req.body;
    if (data.startTime && data.endTime) {
      data.duration = (new Date(data.endTime) - new Date(data.startTime)) / (1000*60);
    }
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE / CANCEL appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTodayAppointments = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      startTime: { $gte: todayStart, $lte: todayEnd }
    }).sort({ startTime: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};