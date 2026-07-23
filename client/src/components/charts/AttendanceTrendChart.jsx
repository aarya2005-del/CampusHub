import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const data = [
  { month: 'Jan', attendance: 88 },
  { month: 'Feb', attendance: 90 },
  { month: 'Mar', attendance: 87 },
  { month: 'Apr', attendance: 92 },
  { month: 'May', attendance: 94 },
  { month: 'Jun', attendance: 96 },
]

function AttendanceTrendChart() {
  return (
    <div className='h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.08)' />

          <XAxis
            dataKey='month'
            stroke='#94A3B8'
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[80, 100]}
            stroke='#94A3B8'
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: '#fff',
            }}
          />

          <Line
            type='monotone'
            dataKey='attendance'
            stroke='#3B82F6'
            strokeWidth={4}
            dot={{ fill: '#3B82F6', strokeWidth: 0, r: 5 }}
            activeDot={{
              r: 8,
              fill: '#3B82F6',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AttendanceTrendChart