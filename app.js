const express = require('express');
const connectDB = require('./config/database');
const driverRoutes = require('./routes/driverRoutes');

const app = express();

connectDB();

app.use(express.json());

app.use('/drivers', driverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
