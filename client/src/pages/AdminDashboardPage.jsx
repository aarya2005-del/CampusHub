import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

import StudentChart from "../components/charts/StudentChart";
import AttendanceTrendChart from "../components/charts/AttendanceTrendChart";
import DepartmentChart from "../components/charts/DepartmentChart";
import EventParticipationChart from "../components/charts/EventParticipationChart";
import ProgressRing from "../components/charts/ProgressRing";

function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [dashboardData, setDashboardData] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [studentYearData, setStudentYearData] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [eventParticipationData, setEventParticipationData] = useState([]);
  const [attendanceTrendData, setAttendanceTrendData] = useState([]);

  // ==============================
  // Dashboard API
  // ==============================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard/stats");

        console.log("Dashboard API:", response.data);

        setDashboardData(response.data);
      } catch (error) {
        console.error(
          "Dashboard API error:",
          error.response?.data || error.message
        );
      }
    };

    fetchDashboardData();
  }, []);
  useEffect(() => {
  const fetchStudentYearData = async () => {
    try {
      const response = await api.get(
        "/analytics/students-by-year"
      );

      console.log("Students by Year API:", response.data);

      setStudentYearData(response.data.stats || []);
    } catch (error) {
      console.error(
        "Students by Year API error:",
        error.response?.data || error.message
      );
    }
  };

  fetchStudentYearData();
}, []);

  // ==============================
  // Department Analytics API
  // ==============================

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await api.get(
          "/analytics/students-by-department"
        );

        console.log("Department API:", response.data);

        setDepartmentData(response.data.stats || []);
      } catch (error) {
        console.error(
          "Department API error:",
          error.response?.data || error.message
        );
      }
    };

    fetchDepartmentData();
  }, []);

  useEffect(() => {
  const fetchAttendanceData = async () => {
    try {
      const response = await api.get("/analytics/attendance");

      console.log("Attendance API:", response.data);

      setAttendanceData(response.data.data);
    } catch (error) {
      console.error(
        "Attendance API error:",
        error.response?.data || error.message
      );
    }
  };

  fetchAttendanceData();
}, []);

useEffect(() => {
  const fetchEventParticipation = async () => {
    try {
      const response = await api.get(
        "/registrations/analytics"
      );

      console.log(
        "Event Participation API:",
        response.data
      );

      setEventParticipationData(
        response.data.stats || []
      );
    } catch (error) {
      console.error(
        "Event Participation API error:",
        error.response?.data || error.message
      );
    }
  };

  fetchEventParticipation();
}, []);

useEffect(() => {
  const fetchAttendanceTrend = async () => {
    try {
      const response = await api.get(
        "/analytics/attendance-trend"
      );

      console.log(
        "Attendance Trend API:",
        response.data
      );

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const chartData = (response.data.stats || []).map(
        (item) => ({
          month: monthNames[item.month - 1],
          attendance: item.attendance,
        })
      );

      setAttendanceTrendData(chartData);
    } catch (error) {
      console.error(
        "Attendance Trend API error:",
        error.response?.data || error.message
      );
    }
  };

  fetchAttendanceTrend();
}, []);

  // ==============================
  // Convert Department API data
  // for the chart
  // ==============================

  const departmentChartData = departmentData.map((item) => ({
    name: item._id,
    value: item.count,
  }));
  const studentYearChartData = studentYearData.map((item) => ({
  year: `Year ${item._id}`,
  students: item.count,
}));

  // ==============================
  // Dashboard Statistics
  // ==============================

  const stats = [
  {
    title: "Students",
    value: dashboardData?.totalStudents ?? 0,
    color: "from-blue-500/20 to-cyan-500/20",
    icon: "👨‍🎓",
  },
  {
    title: "Events",
    value: dashboardData?.totalEvents ?? 0,
    color: "from-purple-500/20 to-pink-500/20",
    icon: "📅",
  },
  {
    title: "Attendance",
    value: `${attendanceData?.attendancePercentage ?? 0}%`,
    color: "from-green-500/20 to-emerald-500/20",
    icon: "✅",
  },
  {
    title: "Notices",
    value: dashboardData?.totalNotices ?? 0,
    color: "from-orange-500/20 to-red-500/20",
    icon: "📢",
  },
];

  return (
    <div className="space-y-8">

      {/* ==============================
          Hero
      ============================== */}

      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
      >
        <div>

          <h1 className="text-5xl lg:text-6xl font-black leading-tight">

            Welcome back,

            <br />

            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {user.name || "Admin"}
            </span>

            👋

          </h1>

          <p className="text-slate-400 text-lg mt-5 max-w-xl">
            Manage students, attendance, events and campus analytics from one
            beautiful dashboard.
          </p>

        </div>

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="bg-slate-900 border border-slate-800 rounded-3xl px-8 py-6 shadow-xl"
        >

          <p className="uppercase tracking-widest text-slate-500 text-sm">
            Today
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}

          </h2>

          <div className="mt-4 inline-block rounded-full bg-blue-500/10 px-4 py-2">

            <span className="text-blue-400 font-semibold">
              Campus Dashboard
            </span>

          </div>

        </motion.div>

      </motion.div>

      {/* ==============================
          Quick Actions
      ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <motion.div
          whileHover={{
            scale: 1.04,
            y: -6,
          }}
        >
          <Link
            to="/students"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 block"
          >

            <h2 className="text-2xl font-bold">
              ➕ Add Student
            </h2>

            <p className="mt-3 text-blue-100">
              Register new students quickly.
            </p>

          </Link>
        </motion.div>

        <Link
          to="/events"
          className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 block hover:scale-105 transition-transform"
        >

          <h2 className="text-2xl font-bold">
            📅 Create Event
          </h2>

          <p className="mt-3 text-purple-100">
            Schedule campus activities.
          </p>

        </Link>

        <Link
          to="/notices"
          className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 block hover:scale-105 transition-transform"
        >

          <h2 className="text-2xl font-bold">
            📢 Publish Notice
          </h2>

          <p className="mt-3 text-green-100">
            Notify students instantly.
          </p>

        </Link>

      </div>

      {/* ==============================
          Statistics
      ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((card) => (

          <motion.div
            key={card.title}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
            }}
            className={`rounded-3xl p-6 bg-gradient-to-br ${card.color}
              border border-white/10
              shadow-xl
              hover:shadow-blue-500/20`}
          >

            <div className="flex justify-between items-center">

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white text-3xl">
                {card.icon}
              </div>

            </div>

            <p className="mt-8 text-slate-400">
              {card.title}
            </p>

            <h2 className="text-5xl font-black mt-2">
              {card.value}
            </h2>

          </motion.div>

        ))}

      </div>

      {/* ==============================
          First Row - Charts
      ============================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <StudentChart data={studentYearChartData} />

        <AttendanceTrendChart data={attendanceTrendData} />

      </div>

      {/* ==============================
          Second Row - Analytics
      ============================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <DepartmentChart data={departmentChartData} />

        <EventParticipationChart
  data={eventParticipationData}
/>

      </div>

      {/* ==============================
          Third Row - Progress
      ============================== */}

      <div className="flex justify-center">

        <div className="bg-slate-900 rounded-3xl p-8 w-full xl:w-[450px]">

          <ProgressRing
  value={attendanceData?.attendancePercentage ?? 0}
/>

        </div>

      </div>

      {/* ==============================
          Recent Activity
      ============================== */}

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          Recent Activity
        </h2>

        <div className="space-y-5">

          {dashboardData?.recentActivity?.length > 0 ? (

            dashboardData.recentActivity.map((activity, index) => (

              <div
                key={activity.id || index}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.type === "student"
                        ? "bg-green-500"
                        : activity.type === "event"
                        ? "bg-blue-500"
                        : activity.type === "notice"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }`}
                  />

                  <span>
                    {activity.message}
                  </span>

                </div>

                <span className="text-slate-500 text-sm">

                  {activity.createdAt
                    ? new Date(activity.createdAt).toLocaleString()
                    : ""}

                </span>

              </div>

            ))

          ) : (

            <p className="text-slate-400">
              No recent activity.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;