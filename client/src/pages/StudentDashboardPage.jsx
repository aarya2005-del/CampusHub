import { Calendar, Bell, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function StudentDashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);

useEffect(() => {
  const fetchStudent = async () => {
    try {
      const response = await api.get("/students/me");
      setStudent(response.data.student);
    } catch (error) {
      console.error("Student profile error:", error);
    }
  };

  fetchStudent();
  const fetchCourses = async () => {
  try {
    const response = await api.get("/enrollments/my-courses");
    setCourses(response.data.enrollments || []);
  } catch (error) {
    console.error("Student courses error:", error);
  }
};

fetchCourses();
}, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold mb-2">
          Student Portal
        </p>

        <h1 className="text-4xl font-black">
          Welcome, {user.name || "Student"} 👋
        </h1>

        <p className="text-slate-400 mt-3">
          Access your academic information and campus activities.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
    <p className="text-slate-400 text-sm">Roll Number</p>
    <p className="text-xl font-bold mt-2">
      {student?.rollNumber || "—"}
    </p>
  </div>

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
    <p className="text-slate-400 text-sm">Department</p>
    <p className="text-xl font-bold mt-2">
      {student?.department || "—"}
    </p>
  </div>

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
    <p className="text-slate-400 text-sm">Year</p>
    <p className="text-xl font-bold mt-2">
      {student?.year ? `Year ${student.year}` : "—"}
    </p>
  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Link
          to="/attendance"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
        >
          <BookOpen className="text-blue-400 mb-4" size={30} />
          <h2 className="font-bold text-lg">My Attendance</h2>
          <p className="text-slate-400 text-sm mt-2">
            View your attendance records.
          </p>
        </Link>

        <Link
          to="/events"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 transition"
        >
          <Calendar className="text-purple-400 mb-4" size={30} />
          <h2 className="font-bold text-lg">Campus Events</h2>
          <p className="text-slate-400 text-sm mt-2">
            Explore upcoming campus events.
          </p>
        </Link>

        <Link
          to="/notices"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500 transition"
        >
          <Bell className="text-amber-400 mb-4" size={30} />
          <h2 className="font-bold text-lg">Notices</h2>
          <p className="text-slate-400 text-sm mt-2">
            Read important campus announcements.
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500 transition"
        >
          <User className="text-emerald-400 mb-4" size={30} />
          <h2 className="font-bold text-lg">My Profile</h2>
          <p className="text-slate-400 text-sm mt-2">
            View and manage your account.
          </p>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
  <div className="flex items-center gap-3 mb-6">
    <BookOpen className="text-blue-400" />
    <h2 className="text-2xl font-bold">My Courses</h2>
  </div>

  {courses.length === 0 ? (
    <p className="text-slate-400">
      You are not enrolled in any courses yet.
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {courses.map((enrollment) => (
        <div
          key={enrollment._id}
          className="bg-slate-950 border border-slate-800 rounded-2xl p-5"
        >
          <p className="text-blue-400 font-bold">
            {enrollment.course?.code}
          </p>

          <h3 className="text-lg font-bold mt-1">
            {enrollment.course?.name}
          </h3>

          <div className="text-slate-400 text-sm mt-4 space-y-1">
            <p>Semester: {enrollment.course?.semester}</p>
            <p>Credits: {enrollment.course?.credits}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}

export default StudentDashboardPage;