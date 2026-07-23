function ProgressRing({ progress = 75 }) {
  const radius = 70
  const stroke = 10
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset =
    circumference - (progress / 100) * circumference

  return (
    <div className='flex flex-col items-center justify-center'>
      <svg height={radius * 2} width={radius * 2} className='-rotate-90'>
        {/* Background */}
        <circle
          stroke='rgba(255,255,255,0.08)'
          fill='transparent'
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress */}
        <circle
          stroke='url(#gradient)'
          fill='transparent'
          strokeWidth={stroke}
          strokeLinecap='round'
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <defs>
          <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#3B82F6' />
            <stop offset='100%' stopColor='#8B5CF6' />
          </linearGradient>
        </defs>
      </svg>

      <div className='-mt-24 text-center'>
        <div className='text-4xl font-black'>{progress}%</div>
        <div className='text-sm text-slate-400 mt-1'>Completion</div>
      </div>
    </div>
  )
}

export default ProgressRing