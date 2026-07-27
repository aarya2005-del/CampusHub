import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", attendance: 90 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 93 },
  { month: "May", attendance: 96 },
  { month: "Jun", attendance: 98 },
];

function AttendanceTrendChart() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 h-[380px]">
      <h2 className="text-2xl font-bold text-white mb-2">
        Attendance Trend
      </h2>

      <p className="text-slate-400 mb-6">
        Attendance over the last 6 months
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
            domain={[85, 100]}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#10B981"
            strokeWidth={4}
            dot={{
              fill: "#10B981",
              strokeWidth: 2,
              r: 5,
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceTrendChart;