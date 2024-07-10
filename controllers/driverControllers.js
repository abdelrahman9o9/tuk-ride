const Driver = require('../models/driverModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerDriver = async (req, res) => {
  const { name, email, phone, password, carDetails, license, location } =
    req.body;

  try {
    const driverExists = await Driver.findOne({ email });
    if (driverExists) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newDriver = new Driver({
      name,
      email,
      phone,
      password: hashedPassword,
      carDetails,
      license,
      location,
    });

    await newDriver.save();

    res.status(201).json({ message: 'Driver registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginDriver = async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, driverId: driver._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;

  try {
    await Driver.findByIdAndUpdate(id, { location });

    res.json({ message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  try {
    await Driver.findByIdAndUpdate(id, { availability });

    res.json({ message: 'Availability updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDriverDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id).populate('reviews.user', 'name');

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.reviews.push({ user: req.user.id, rating, comment });
    await driver.save();

    res.json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id).populate('reviews.user', 'name');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
