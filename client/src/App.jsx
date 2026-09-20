import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import StudentsPage from "./pages/StudentsPage";
import EventsPage from "./pages/EventsPage";
import AttendancePage from "./pages/AttendancePage";
import StudentAttendancePage from "./pages/StudentAttendancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NoticesPage from "./pages/NoticesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CoursesPage from "./pages/CoursesPage";
import TimetablePage from "./pages/TimetablePage";
import StudentTimetablePage from "./pages/StudentTimetablePage";
import StudentPlannerPage from "./pages/StudentPlannerPage";
import ExamsPage from "./pages/ExamsPage";
import StudentExamsPage from "./pages/StudentExamsPage";
import ResultsPage from "./pages/ResultsPage";
import StudentResultsPage from "./pages/StudentResultsPage";
import StudentAdmitCardPage from "./pages/StudentAdmitCardPage";
import FeesPage from "./pages/FeesPage";
import StudentFeesPage from "./pages/StudentFeesPage";
import LostFoundPage from "./pages/LostFoundPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import StudentAssignmentsPage from "./pages/StudentAssignmentsPage";
import NotificationsPage from "./pages/NotificationsPage";
// Toasts
import { Toaster } from "react-hot-toast";

// Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" replace />;
}
function RoleRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard */}
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        {JSON.parse(localStorage.getItem("user") || "{}").role === "admin" ? (
          <AdminDashboardPage />
        ) : (
          <StudentDashboardPage />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
       <Route
  path="/students"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <StudentsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Courses */}
<Route
  path="/courses"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <CoursesPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Timetable */}
<Route
  path="/timetable"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <TimetablePage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Exams */}
<Route
  path="/exams"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <ExamsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Results */}
<Route
  path="/results"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <ResultsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Fees Management */}
<Route
  path="/fees"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <FeesPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>

{/* Student Timetable */}
<Route
  path="/my-timetable"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentTimetablePage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Student Exams */}
<Route
  path="/my-exams"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentExamsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Student Results */}
<Route
  path="/my-results"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentResultsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Student Admit Card */}
<Route
  path="/my-admit-card"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentAdmitCardPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Student Fees */}
<Route
  path="/my-fees"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentFeesPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>

{/* Student Personal Planner */}
<Route
  path="/my-planner"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentPlannerPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
        {/* Events */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EventsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Attendance */}
<Route
  path="/attendance"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <AttendancePage />
      </DashboardLayout>
    </RoleRoute>
  }
/>

{/* Student Attendance */}
<Route
  path="/my-attendance"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentAttendancePage />
      </DashboardLayout>
    </RoleRoute>
  }
/>

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Notices */}
        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NoticesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/lost-found"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <LostFoundPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/assignments"
  element={
    <RoleRoute allowedRoles={["admin", "faculty"]}>
      <DashboardLayout>
        <AssignmentsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
<Route
  path="/my-assignments"
  element={
    <RoleRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <StudentAssignmentsPage />
      </DashboardLayout>
    </RoleRoute>
  }
/>
{/* Notifications */}
<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <NotificationsPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;