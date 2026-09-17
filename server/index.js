require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Database
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const studentRoutes = require('./routes/studentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');
const admitCardRoutes = require('./routes/admitCardRoutes');
const feeRoutes = require('./routes/feeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// Middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger');

// Connect Database
connectDB();

// Create Express App
const app = express();

// ================= MIDDLEWARE =================

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// ================= API ROUTES =================

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admit-card', admitCardRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);


// ================= SWAGGER DOCUMENTATION =================

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
// ================= ROOT ROUTE =================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusHub API is running',
  });
});

// ================= GLOBAL ERROR HANDLER =================
// MUST BE THE LAST MIDDLEWARE

app.use(errorMiddleware);

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});