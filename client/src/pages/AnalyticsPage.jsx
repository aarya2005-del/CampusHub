import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import api from "../services/api";

const MONTHS = [
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

const PIE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  const [departmentData, setDepartmentData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [attendance, setAttendance] = useState({
    totalClasses: 0,
    presentClasses: 0,
    absentClasses: 0,
    attendancePercentage: 0,
  });
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [eventsYear, setEventsYear] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const [
          departmentResponse,
          yearResponse,
          eventsResponse,
          attendanceResponse,
          trendResponse,
        ] = await Promise.all([
          api.get("/analytics/students-by-department"),
          api.get("/analytics/students-by-year"),
          api.get("/analytics/events-per-month"),
          api.get("/analytics/attendance"),
          api.get("/analytics/attendance-trend"),
        ]);

        setDepartmentData(
          (departmentResponse.data?.stats || []).map(
            (item) => ({
              name: item._id || "Unknown",
              students: item.count,
            })
          )
        );

        setYearData(
          (yearResponse.data?.stats || []).map((item) => ({
            year: `Year ${item._id}`,
            students: item.count,
          }))
        );

        const monthlyEvents = MONTHS.map((month, index) => {
          const found = (
            eventsResponse.data?.stats || []
          ).find((item) => item._id === index + 1);

          return {
            month,
            events: found?.count || 0,
          };
        });

        setEventsData(monthlyEvents);

        setEventsYear(
          eventsResponse.data?.year ||
            new Date().getFullYear()
        );

        setAttendance(
          attendanceResponse.data?.data || {
            totalClasses: 0,
            presentClasses: 0,
            absentClasses: 0,
            attendancePercentage: 0,
          }
        );

        setAttendanceTrend(
          (trendResponse.data?.stats || []).map((item) => ({
            month: `${
              MONTHS[item.month - 1]
            } ${String(item.year).slice(-2)}`,
            attendance: item.attendance,
          }))
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalStudents = departmentData.reduce(
    (total, item) => total + item.students,
    0
  );

  const totalEvents = eventsData.reduce(
    (total, item) => total + item.events,
    0
  );

  if (loading) {
    return (
      <div className="text-white">
        <h1 className="text-4xl font-black mb-2">
          Analytics
        </h1>

        <p className="text-slate-400 mb-8">
          Campus analytics and reports.
        </p>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-slate-400">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black">
          Analytics
        </h1>

        <p className="text-slate-400 mt-2">
          Campus performance and activity insights.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users size={23} />}
        />

        <StatCard
          title={`Events in ${eventsYear}`}
          value={totalEvents}
          icon={<CalendarDays size={23} />}
        />

        <StatCard
          title="Attendance"
          value={`${attendance.attendancePercentage}%`}
          icon={<TrendingUp size={23} />}
        />

        <StatCard
          title="Attendance Records"
          value={attendance.totalClasses}
          icon={<BarChart3 size={23} />}
        />
      </div>

      {/* First Row */}
      <div className="grid xl:grid-cols-2 gap-6 mb-6">
        {/* Department */}
        <ChartCard
          title="Students by Department"
          subtitle="Distribution across departments"
        >
          {departmentData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={departmentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  stroke="#94a3b8"
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />

                <Bar
                  dataKey="students"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Year */}
        <ChartCard
          title="Students by Year"
          subtitle="Student distribution by academic year"
        >
          {yearData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={yearData}
                  dataKey="students"
                  nameKey="year"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  label={({ year, students }) =>
                    `${year}: ${students}`
                  }
                >
                  {yearData.map((entry, index) => (
                    <Cell
                      key={entry.year}
                      fill={
                        PIE_COLORS[
                          index % PIE_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Events */}
      <ChartCard
        title={`Events per Month - ${eventsYear}`}
        subtitle="Number of campus events scheduled each month"
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={eventsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
              }}
            />

            <Bar
              dataKey="events"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Attendance */}
      <div className="grid xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <ChartCard
            title="Attendance Trend"
            subtitle="Attendance percentage over the last six months"
          >
            {attendanceTrend.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <LineChart data={attendanceTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="#94a3b8"
                    unit="%"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius: "12px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <GraduationCap size={23} />
            </div>

            <div>
              <h2 className="font-black text-lg">
                Attendance Summary
              </h2>

              <p className="text-xs text-slate-400">
                Overall attendance records
              </p>
            </div>
          </div>

          <div className="text-center py-5">
            <p className="text-5xl font-black text-green-400">
              {attendance.attendancePercentage}%
            </p>

            <p className="text-slate-400 mt-2">
              Overall Attendance
            </p>
          </div>

          <div className="space-y-3 mt-5">
            <AttendanceRow
              label="Total Records"
              value={attendance.totalClasses}
            />

            <AttendanceRow
              label="Present"
              value={attendance.presentClasses}
            />

            <AttendanceRow
              label="Absent"
              value={attendance.absentClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="text-3xl font-black mt-2">
            {value}
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black">
          {title}
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}

function AttendanceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="font-black">{value}</span>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[320px] flex items-center justify-center text-slate-500">
      No analytics data available.
    </div>
  );
}

export default AnalyticsPage;