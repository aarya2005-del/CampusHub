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
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 h-[420px] sm:h-[380px] overflow-hidden">

      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Students by Department
      </h2>

      <p className="text-sm sm:text-base text-slate-400 mb-3 sm:mb-4">
        Distribution of students across departments
      </p>

      <div className="w-full h-[300px] sm:h-[285px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="43%"
              innerRadius="40%"
              outerRadius="67%"
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
              align="center"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{
                color: "#fff",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default DepartmentChart;