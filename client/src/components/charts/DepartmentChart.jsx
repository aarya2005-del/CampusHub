import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Computer Science", value: 420 },
  { name: "Information Technology", value: 280 },
  { name: "Electronics", value: 210 },
  { name: "Mechanical", value: 170 },
];

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
];

function DepartmentChart() {
  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
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
                fill={COLORS[index]}
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