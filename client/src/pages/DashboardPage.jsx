import {
  Users,
  CalendarDays,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import * as CountUp from "react-countup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import StudentChart from "../components/charts/StudentChart";
import AttendanceTrendChart from "../components/charts/AttendanceTrendChart";
import DepartmentChart from "../components/charts/DepartmentChart";
import EventParticipationChart from "../components/charts/EventParticipationChart";
import ProgressRing from "../components/charts/ProgressRing";

function DashboardPage() {
  console.log(CountUp);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const stats = [
  {
    title: "Students",
    value: 1248,
    change: "+12%",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: <Users size={28} />,
  },
  {
    title: "Events",
    value: 24,
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
const activities = [
  {
    id: 1,
    type: "student",
    color: "bg-green-500",
    message: (
      <>
        Student <b>John Doe</b> registered.
      </>
    ),
    time: "5 mins ago",
  },
  {
    id: 2,
    type: "event",
    color: "bg-blue-500",
    message: (
      <>
        New event <b>Hackathon 2026</b> created.
      </>
    ),
    time: "20 mins ago",
  },
  {
    id: 3,
    type: "attendance",
    color: "bg-purple-500",
    message: <>Attendance updated for Semester 5.</>,
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "notice",
    color: "bg-orange-500",
    message: (
      <>
        Notice <b>Exam Schedule</b> published.
      </>
    ),
    time: "Today",
  },
];
  return (
    <div className="space-y-8">

      {/* Hero */}
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

      Manage students, attendance, events and campus analytics from one beautiful dashboard.

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

      {/* Quick Actions */}

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

      {/* Statistics */}

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

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white">

  {card.icon}

</div>
              <div className="flex items-center gap-1 text-green-400 font-bold">

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
          </motion.div>

        ))}

      </div>

      {/* First Row */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

  <StudentChart />

  <AttendanceTrendChart />

</div>

{/* Second Row */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

  <DepartmentChart />

  <EventParticipationChart />

</div>

{/* Third Row */}

<div className="flex justify-center">

  <div className="bg-slate-900 rounded-3xl p-8 w-full xl:w-[450px]">

    <ProgressRing />

  </div>

</div>
{/* Recent Activity */}

<div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">

  <h2 className="text-2xl font-bold mb-6 text-white">
    Recent Activity
  </h2>

  <div className="space-y-5">

   {activities.map((activity) => (

      <div
       key={activity.id}
        className="flex items-center justify-between gap-4"
      >

        <div className="flex items-center gap-4">

          <div
            className={`w-3 h-3 rounded-full ${activity.color}`}
          />

          <span className="text-slate-300">
           {activity.message}
          </span>

        </div>

        <span className="text-slate-500 text-sm whitespace-nowrap">
          {activity.time}
        </span>

      </div>

    ))}

  </div>

</div>

    </div>
  );
}

export default DashboardPage;