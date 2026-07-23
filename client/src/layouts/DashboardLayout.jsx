import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  Bell,
  Search,
  LogOut,
} from 'lucide-react'

function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className='min-h-screen bg-[#070B1A] text-white flex'>
      {/* Sidebar */}
      <aside className='w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col'>
        <div className='mb-10'>
          <h1 className='text-3xl font-black tracking-tight'>
            Campus<span className='text-blue-400'>Hub</span>
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            College ERP Platform
          </p>
        </div>

        {/* Profile Card */}
        <div className='bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-3xl p-5 mb-8'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl font-bold'>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h3 className='font-bold text-lg'>{user?.name}</h3>
              <p className='text-slate-300 capitalize'>{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='space-y-2 flex-1'>
          <button className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25'>
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-slate-300 hover:text-white'>
            <Users size={20} />
            Students
          </button>

          <button className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-slate-300 hover:text-white'>
            <Calendar size={20} />
            Events
          </button>

          <button className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-slate-300 hover:text-white'>
            <ClipboardCheck size={20} />
            Attendance
          </button>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/20 text-red-400 transition-all duration-200'
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        {/* Top Navbar */}
        <header className='sticky top-0 z-10 bg-[#070B1A]/80 backdrop-blur-xl border-b border-white/10 px-8 py-5'>
          <div className='flex items-center justify-between'>
            {/* Search */}
            <div className='relative w-full max-w-xl'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Search students, events, notices...'
                className='w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
              />
            </div>

            {/* Right Section */}
            <div className='flex items-center gap-4 ml-6'>
              <button className='relative p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all'>
                <Bell size={20} />
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold'>
                  3
                </span>
              </button>

              <div className='flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold'>
                  {user?.name?.charAt(0)}
                </div>
                <div className='hidden md:block'>
                  <p className='font-semibold text-sm'>{user?.name}</p>
                  <p className='text-slate-400 text-xs capitalize'>{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className='p-8'>{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout