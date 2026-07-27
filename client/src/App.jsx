import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import EventsPage from "./pages/EventsPage";
import AttendancePage from "./pages/AttendancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NoticesPage from "./pages/NoticesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Toasts
import { Toaster } from "react-hot-toast";

// Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" replace />;
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
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Students */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentsPage />
              </DashboardLayout>
            </ProtectedRoute>
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

        {/* Attendance */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AttendancePage />
              </DashboardLayout>
            </ProtectedRoute>
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

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;