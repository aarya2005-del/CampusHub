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

const data = [
  { event: "Tech Fest", students: 420 },
  { event: "Hackathon", students: 310 },
  { event: "Sports", students: 380 },
  { event: "Workshop", students: 260 },
  { event: "Cultural", students: 470 },
];

const colors = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

function EventParticipationChart() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 h-[380px]">
      <h2 className="text-2xl font-bold text-white mb-2">
        Event Participation
      </h2>

      <p className="text-slate-400 mb-6">
        Students participating in campus events
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="event"
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

          <Bar
            dataKey="students"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.event}
                fill={colors[index]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventParticipationChart;