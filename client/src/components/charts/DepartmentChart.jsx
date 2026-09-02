import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
];

function DepartmentChart({ data = [] }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 h-[380px]">

      <h2 className="text-2xl font-bold text-white mb-2">
        Students by Department
      </h2>

      <p className="text-slate-400 mb-6">
        Distribution of students across departments
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={4}
            label={({ percent }) =>
              `${(percent * 100).toFixed(0)}%`
            }
          >

            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              color: "#fff",
              paddingTop: "20px",
            }}
          />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default DepartmentChart;