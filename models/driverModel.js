const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  carDetails: {
    type: { type: String, required: true },
    plateNumber: { type: String, required: true },
    color: { type: String, required: true },
  },
  license: {
    number: { type: String, required: true },
    expiryDate: { type: Date, required: true },
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      comment: { type: String },
    },
  ],
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
