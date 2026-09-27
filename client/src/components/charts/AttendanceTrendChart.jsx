import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function AttendanceTrendChart({ data = [] }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 h-[380px] overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Attendance Trend
      </h2>

      <p className="text-sm sm:text-base text-slate-400 mb-4">
        Monthly attendance percentage
      </p>

      <div className="w-full h-[260px] sm:h-[265px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 15 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#94a3b8"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, "Attendance"]}
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
              name="Attendance"
              stroke="#10B981"
              strokeWidth={4}
              dot={{
                fill: "#10B981",
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceTrendChart;