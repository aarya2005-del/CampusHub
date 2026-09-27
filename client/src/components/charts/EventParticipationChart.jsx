import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const colors = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

function EventParticipationChart({ data = [] }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 h-[420px] sm:h-[380px] overflow-hidden">

      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Event Participation
      </h2>

      <p className="text-sm sm:text-base text-slate-400 mb-4">
        Registered students across campus events
      </p>

      <div className="w-full h-[290px] sm:h-[275px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 5,
              left: -15,
              bottom: 25,
            }}
          >
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="event"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={55}
            />

            <YAxis
              stroke="#94a3b8"
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="students"
              name="Registered Students"
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.eventId}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default EventParticipationChart;