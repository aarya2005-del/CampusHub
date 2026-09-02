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
    <div className="bg-slate-900 rounded-3xl p-6 h-[380px]">

      <h2 className="text-2xl font-bold text-white mb-2">
        Students by Year
      </h2>

      <p className="text-slate-400 mb-6">
        Distribution of students across academic years
      </p>

      <ResponsiveContainer width="100%" height="80%">

        <AreaChart data={data}>

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
          />

          <YAxis
            stroke="#94a3b8"
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
  );
}

export default StudentChart;