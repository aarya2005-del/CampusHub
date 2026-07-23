import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Computer Science', value: 45 },
  { name: 'Electronics', value: 25 },
  { name: 'Mechanical', value: 18 },
  { name: 'Civil', value: 12 },
]

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981']

function DepartmentChart() {
  return (
    <div className='h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className='grid grid-cols-2 gap-3 mt-4'>
        {data.map((item, index) => (
          <div key={item.name} className='flex items-center gap-2'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className='text-sm text-slate-300'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DepartmentChart