console.log("STEP 1");

require('dotenv').config();

console.log("STEP 2");

const express = require('express');

console.log("STEP 3");

const cors = require('cors');

console.log("STEP 4");

const connectDB = require('./config/db');

console.log("STEP 5");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CampusHub API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});