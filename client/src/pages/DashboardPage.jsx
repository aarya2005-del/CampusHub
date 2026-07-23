function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className='min-h-screen bg-slate-900 text-white'>
      <div className='flex'>
        {/* Sidebar */}
        <aside className='w-64 h-screen bg-slate-800 border-r border-slate-700 p-6'>
          <h2 className='text-2xl font-bold mb-8'>CampusHub</h2>

          <nav className='space-y-3'>
            <button className='w-full text-left px-4 py-3 rounded-lg bg-blue-600'>
              Dashboard
            </button>

            <button className='w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors'>
              Students
            </button>

            <button className='w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors'>
              Events
            </button>

            <button className='w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors'>
              Attendance
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-8'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold mb-2'>
              Welcome back, {user?.name}
            </h1>
            <p className='text-slate-400'>
              Role: {user?.role}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-slate-800 p-6 rounded-2xl border border-slate-700'>
              <p className='text-slate-400 text-sm'>Total Students</p>
              <h3 className='text-3xl font-bold mt-2'>1</h3>
            </div>

            <div className='bg-slate-800 p-6 rounded-2xl border border-slate-700'>
              <p className='text-slate-400 text-sm'>Events</p>
              <h3 className='text-3xl font-bold mt-2'>2</h3>
            </div>

            <div className='bg-slate-800 p-6 rounded-2xl border border-slate-700'>
              <p className='text-slate-400 text-sm'>Attendance</p>
              <h3 className='text-3xl font-bold mt-2'>100%</h3>
            </div>

            <div className='bg-slate-800 p-6 rounded-2xl border border-slate-700'>
              <p className='text-slate-400 text-sm'>Registrations</p>
              <h3 className='text-3xl font-bold mt-2'>1</h3>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage