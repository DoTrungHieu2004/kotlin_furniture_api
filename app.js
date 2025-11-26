const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('public/uploads'));

// Routes
app.use('/api/user', userRoutes);

module.exports = app;