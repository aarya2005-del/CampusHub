import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const data = [
  { event: 'Tech Fest', participants: 120 },
  { event: 'Sports', participants: 95 },
  { event: 'Workshop', participants: 78 },
  { event: 'Hackathon', participants: 150 },
]

function EventParticipationChart() {
  return (
    <div className='h-72'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.08)' />

          <XAxis
            dataKey='event'
            stroke='#94A3B8'
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
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

          <Bar
            dataKey='participants'
            fill='#8B5CF6'
            radius={[12, 12, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EventParticipationChart