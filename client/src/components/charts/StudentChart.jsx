import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function StudentChart({ data = [] }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 h-[380px] overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Students by Year
      </h2>

      <p className="text-sm sm:text-base text-slate-400 mb-4">
        Distribution of students across academic years
      </p>

      <div className="w-full h-[260px] sm:h-[265px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 15 }}
          >
            <defs>
              <linearGradient
                id="studentFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />

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
              fill="url(#studentFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StudentChart;