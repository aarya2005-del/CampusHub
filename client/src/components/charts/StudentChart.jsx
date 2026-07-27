import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 180 },
  { month: "Mar", students: 240 },
  { month: "Apr", students: 320 },
  { month: "May", students: 410 },
  { month: "Jun", students: 520 },
];

function StudentChart() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 h-[380px]">
      <h2 className="text-2xl font-bold text-white mb-2">
        Student Admissions
      </h2>

      <p className="text-slate-400 mb-6">
        Admissions during the last 6 months
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="studentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="students"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#studentFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StudentChart;