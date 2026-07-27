import {
  Users,
  CalendarDays,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  Plus,
  UserPlus,
  CalendarPlus,
  FileText,
} from "lucide-react";

import StudentChart from "../components/charts/StudentChart";
import AttendanceTrendChart from "../components/charts/AttendanceTrendChart";
import DepartmentChart from "../components/charts/DepartmentChart";
import EventParticipationChart from "../components/charts/EventParticipationChart";
import ProgressRing from "../components/charts/ProgressRing";
import { Link } from "react-router-dom";

function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const stats = [
    {
      title: "Students",
      value: "1,248",
      change: "+12%",
      color: "from-blue-500/20 to-cyan-500/20",
      icon: <Users size={28} />,
    },
    {
      title: "Events",
      value: "24",
      change: "+8%",
      color: "from-purple-500/20 to-pink-500/20",
      icon: <CalendarDays size={28} />,
    },
    {
      title: "Attendance",
      value: "96%",
      change: "+3%",
      color: "from-green-500/20 to-emerald-500/20",
      icon: <ClipboardCheck size={28} />,
    },
    {
      title: "Growth",
      value: "15%",
      change: "+5%",
      color: "from-orange-500/20 to-red-500/20",
      icon: <TrendingUp size={28} />,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Hero Section */}

      <div className="flex items-center justify-between flex-wrap gap-6">

        <div>

          <h1 className="text-5xl font-black text-white">
            Welcome back,
            <span className="text-blue-400">
              {" "}
              {user?.name || "Admin"}
            </span>
            👋
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Here's what's happening in your campus today.
          </p>

        </div>

        <div className="text-right">

          <p className="text-slate-400">
            Today
          </p>

          <h2 className="text-3xl font-bold text-white">
            Thursday, July 24
          </h2>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <Link
  to="/students"
  className="block bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-left hover:scale-105 transition"
>
          <Plus size={34} />

          <h3 className="mt-5 text-2xl font-bold">
            Add Student
          </h3>

          <p className="text-blue-100 mt-2">
            Register a new student
          </p>

        </Link>

        <Link
  to="/events"
  className="block bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-left hover:scale-105 transition"
>
          <CalendarPlus size={34} />

          <h3 className="mt-5 text-2xl font-bold">
            Create Event
          </h3>

          <p className="text-purple-100 mt-2">
            Schedule campus events
          </p>

        </Link>

        <Link
  to="/notices"
  className="block bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-6 text-left hover:scale-105 transition"
>
          <FileText size={34} />

          <h3 className="mt-5 text-2xl font-bold">
            Publish Notice
          </h3>

          <p className="text-green-100 mt-2">
            Send announcements instantly
          </p>

        </Link>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((card) => (

          <div
            key={card.title}
            className={`rounded-3xl p-6 border border-white/10 bg-gradient-to-br ${card.color}`}
          >

            <div className="flex justify-between">

              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">

                {card.icon}

              </div>

              <div className="flex items-center text-green-400 font-bold">

                <ArrowUpRight size={18} />

                {card.change}

              </div>

            </div>

            <p className="mt-8 text-slate-400">

              {card.title}

            </p>

            <h2 className="text-5xl font-black mt-2">

              {card.value}

            </h2>

          </div>

        ))}

      </div>
      <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
  <h2 className="text-2xl font-bold text-white mb-6">
    Student Admissions
  </h2>

  <StudentChart />
</div>
            {/* Analytics Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Department Distribution */}

        <div className="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-white">
                Campus Analytics
              </h2>

              <p className="text-slate-400">
                Department-wise student distribution
              </p>

            </div>

            <Link
  to="/analytics"
  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition"
>
  View Report
</Link>
             
          </div>

          <DepartmentChart />

        </div>

        {/* Attendance Progress */}

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <h2 className="text-2xl font-bold">
            Attendance
          </h2>

          <p className="text-slate-400 mb-6">
            Current semester
          </p>

          <div className="flex justify-center">

           <ProgressRing
  value={96}
  title="Overall Attendance"
/>

          </div>

          <div className="mt-8 space-y-4">

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-400">
                  Present
                </span>

                <span>
                  96%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-800">

                <div className="h-3 rounded-full bg-green-500 w-[96%]" />

              </div>

            </div>

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-400">
                  Absent
                </span>

                <span>
                  4%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-800">

                <div className="h-3 rounded-full bg-red-500 w-[4%]" />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <h2 className="text-2xl font-bold">
            Attendance Trend
          </h2>

          <p className="text-slate-400 mb-6">
            Last 6 months
          </p>

          <AttendanceTrendChart />

        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <h2 className="text-2xl font-bold">
            Event Participation
          </h2>

          <p className="text-slate-400 mb-6">
            Campus engagement
          </p>

          <EventParticipationChart />

        </div>

      </div>
            {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Upcoming Events */}

        <div className="xl:col-span-1 rounded-3xl bg-white/5 border border-white/10 p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Upcoming Events
            </h2>

            <button className="text-blue-400 hover:text-blue-300">
              View All
            </button>

          </div>

          <div className="space-y-4">

            {[
              {
                title: "Tech Fest 2026",
                date: "Tomorrow • 10:00 AM",
                place: "Main Auditorium",
              },
              {
                title: "AI Workshop",
                date: "Friday • 2:00 PM",
                place: "Computer Lab",
              },
              {
                title: "Hackathon",
                date: "Monday • 9:00 AM",
                place: "Innovation Center",
              },
            ].map((event) => (

              <div
                key={event.title}
                className="bg-slate-800/60 rounded-2xl p-4 hover:bg-slate-800 transition"
              >

                <h3 className="font-semibold text-lg">
                  {event.title}
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  {event.date}
                </p>

                <p className="text-slate-500 text-sm">
                  {event.place}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Recent Students */}

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Recent Students
            </h2>

            <button className="text-blue-400">
              View All
            </button>

          </div>

          <div className="space-y-5">

            {[
              "Aarav Sharma",
              "Priya Patel",
              "Rohan Verma",
              "Neha Singh",
            ].map((student, index) => (

              <div
                key={student}
                className="flex items-center gap-4"
              >

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">

                  {student.charAt(0)}

                </div>

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {student}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Computer Science
                  </p>

                </div>

                <span className="text-green-400 text-sm">
                  Active
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Notices */}

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Latest Notices
            </h2>

            <button className="text-blue-400">
              View All
            </button>

          </div>

          <div className="space-y-5">

            <div className="border-l-4 border-blue-500 pl-4">

              <h3 className="font-semibold">
                Semester Registration
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Registration closes on July 30.
              </p>

            </div>

            <div className="border-l-4 border-green-500 pl-4">

              <h3 className="font-semibold">
                Placement Drive
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Infosys and TCS arriving next week.
              </p>

            </div>

            <div className="border-l-4 border-yellow-500 pl-4">

              <h3 className="font-semibold">
                Library Notice
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Library timings extended until 10 PM.
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* Activity Feed & Performance */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Activity */}

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <h2 className="text-2xl font-bold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-5">

            {[
              {
                title: "New student registered",
                desc: "Aarav Sharma joined Computer Science.",
                time: "5 mins ago",
              },
              {
                title: "Attendance marked",
                desc: "Faculty updated attendance for Semester 5.",
                time: "20 mins ago",
              },
              {
                title: "Event created",
                desc: "AI Workshop has been scheduled.",
                time: "1 hour ago",
              },
              {
                title: "Notice published",
                desc: "Placement drive notice is now live.",
                time: "3 hours ago",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="flex gap-4 items-start"
              >

                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {item.desc}
                  </p>

                  <p className="text-slate-500 text-xs mt-2">
                    {item.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Performance Summary */}

        <div className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-6">

          <h2 className="text-2xl font-bold mb-6">
            Campus Performance
          </h2>

          <div className="space-y-6">

            <div>

              <div className="flex justify-between mb-2">

                <span>Student Satisfaction</span>

                <span>94%</span>

              </div>

              <div className="w-full h-3 rounded-full bg-slate-800">

                <div className="w-[94%] h-3 rounded-full bg-blue-500"></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Event Success</span>

                <span>88%</span>

              </div>

              <div className="w-full h-3 rounded-full bg-slate-800">

                <div className="w-[88%] h-3 rounded-full bg-green-500"></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Attendance Rate</span>

                <span>96%</span>

              </div>

              <div className="w-full h-3 rounded-full bg-slate-800">

                <div className="w-[96%] h-3 rounded-full bg-purple-500"></div>

              </div>

            </div>

          </div>

        </div>

      </div>
     

    </div>
  );
}

export default DashboardPage;