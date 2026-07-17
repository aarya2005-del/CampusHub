require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
console.log(authRoutes);
const noticeRoutes = require("./routes/noticeRoutes");
const studentRoutes = require("./routes/studentRoutes");
connectDB();

const app = express();
console.log("Express app created");

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/students", studentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CampusHub API is running' });
});

const PORT = process.env.PORT || 5000;
console.log("About to listen...");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});