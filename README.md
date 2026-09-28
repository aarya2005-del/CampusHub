# CampusHub

A full-stack college management platform built to bring academic and campus operations into one centralized system.

CampusHub provides separate experiences for administrators and students, covering student management, courses, attendance, examinations, assignments, results, fees, events, notices, analytics, lost & found, and other day-to-day campus activities.

## Live Demo

**Live Application:** https://campushub-pink.vercel.app

**GitHub Repository:** https://github.com/aarya2005-del/CampusHub

---

## Features

### Admin Portal

- Dashboard with campus statistics and analytics
- Student management
- Course management and student enrollment
- Daily attendance management
- Timetable management
- Examination scheduling
- Assignment management
- Student results management
- Fee record and payment management
- Campus event management
- Notice and announcement management
- Lost & Found management
- Analytics and data visualization
- Report generation
- Audit logs
- Profile and settings management

### Student Portal

- Personalized student dashboard
- View attendance records
- View assignments
- View examinations
- View academic results
- View fee records
- Online fee payment integration
- View timetable
- Student planner
- Admit card access
- Campus events and notices
- Lost & Found access
- Profile management

---

## Analytics Dashboard

CampusHub includes visual analytics for understanding campus activity, including:

- Students by academic year
- Students by department
- Attendance trends
- Event participation
- Dashboard statistics and summaries

Charts are implemented using Recharts and responsive containers for desktop and mobile layouts.

---

## Payments

CampusHub integrates Razorpay for student fee payments.

The payment workflow includes:

- Server-side Razorpay order creation
- Razorpay Checkout on the client
- Server-side payment verification
- Payment reference tracking
- Fee balance updates

Sensitive Razorpay credentials remain on the server and are loaded through environment variables.

---

## File & Image Uploads

Cloudinary is used for cloud-based media storage.

CampusHub supports image/file upload functionality for features such as Lost & Found and other supported resources.

---

## Responsive Design

CampusHub is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

The interface includes responsive dashboards, navigation, forms, cards, charts, tables, and custom dropdown components optimized for smaller screens.

---

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- React Router
- Axios
- Recharts
- Framer Motion
- Lucide React
- React Hot Toast
- React Loading Skeleton
- React CountUp

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Joi
- Validator
- Express Rate Limit
- Multer

### Services & Integrations

- Cloudinary
- Razorpay
- Swagger / OpenAPI

### Deployment

- Vercel — frontend
- Production Node.js API — backend
- MongoDB — database

---

## Architecture

CampusHub follows a client-server architecture:

```text
React / Vite Frontend
        |
        | REST API
        v
Node.js / Express Backend
        |
        v
MongoDB Database

External services:
- Cloudinary -> media storage
- Razorpay -> payments
```

The frontend communicates with the backend through Axios. Protected API requests include JWT authentication tokens.

---

## Project Structure

```text
CampusHub/
|
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |
|   `-- package.json
|
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- .env.example
|   |-- index.js
|   `-- package.json
|
|-- vercel.json
|-- README.md
`-- LICENSE
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/aarya2005-del/CampusHub.git
cd CampusHub
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create:

```text
server/.env
```

Use `server/.env.example` as the template:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Never commit your real `.env` file or production credentials.

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

The development API runs on:

```text
http://localhost:5000
```

### 6. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite.

---

## Production Build

To create the frontend production build:

```bash
cd client
npm run build
```

The generated production files are placed in `client/dist`.

---

## API Documentation

The backend includes Swagger/OpenAPI tooling for API documentation.

The API architecture includes routes for authentication and CampusHub's academic and campus-management modules.

---

## Security

CampusHub uses several backend security practices, including:

- JWT-based authentication
- Password hashing with bcrypt
- Environment variables for sensitive credentials
- Server-side Razorpay signature verification
- Request rate limiting
- Backend input validation
- Protected API routes
- Server-side Cloudinary credentials

Production secrets are not stored in the frontend source code.

---

## Key Development Challenges

Building CampusHub involved solving several full-stack and deployment challenges, including:

- Designing separate Admin and Student workflows
- Connecting a React frontend to a production REST API
- Implementing JWT authentication and protected routes
- Managing academic data across multiple modules
- Building responsive analytics dashboards
- Implementing online payment verification
- Handling cloud-based file uploads
- Making complex forms and dropdowns mobile-friendly
- Configuring production environment variables
- Handling SPA routing and direct page refreshes in production
- Deploying the frontend and backend independently

---

## Future Improvements

Possible future improvements include:

- Real-time notifications
- Email notifications
- Advanced role and permission management
- Additional analytics and reporting
- Performance optimization and route-level code splitting
- Progressive Web App support
- Automated testing and CI/CD improvements

---

## Author

**Aarya**

GitHub: https://github.com/aarya2005-del

---

## License

This project is licensed under the terms included in the repository's `LICENSE` file.