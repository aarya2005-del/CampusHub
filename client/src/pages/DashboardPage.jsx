import { useEffect, useState } from 'react'
import {
  Users,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  ArrowUpRight,
  Clock,
  MapPin,
} from 'lucide-react'

import DashboardLayout from '../layouts/DashboardLayout'
import api from '../services/api'

// Charts
import DepartmentChart from '../components/charts/DepartmentChart'
import AttendanceTrendChart from '../components/charts/AttendanceTrendChart'
import EventParticipationChart from '../components/charts/EventParticipationChart'
import ProgressRing from '../components/charts/ProgressRing'

// ================= STAT CARD =================
function StatCard({ title, value, icon: Icon, gradient, change }) {
  return (
    <div className='group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]'>
      <div
        className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`}
      />

      <div className='relative flex items-start justify-between mb-4'>
        <div className='p-3 rounded-2xl bg-white/10'>
          <Icon size={24} className='text-white' />
        </div>

        <div className='flex items-center gap-1 text-green-400 text-sm font-semibold'>
          <ArrowUpRight size={16} />
          {change}
        </div>
      </div>

      <div className='relative'>
        <p className='text-slate-400 text-sm font-medium'>{title}</p>
        <h3 className='text-4xl font-black mt-2 tracking-tight'>{value}</h3>
      </div>
    </div>
  )
}

// ================= DASHBOARD PAGE =================
function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEvents: 0,
    totalNotices: 0,
    upcomingEvents: 0,
  })

  const [loading, setLoading] = useState(true)

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats')

      console.log('Dashboard API Response:', response.data)

      // Handle both response formats safely
      const dashboardData = response.data.data || response.data

      setStats({
        totalStudents: dashboardData.totalStudents || 0,
        totalEvents: dashboardData.totalEvents || 0,
        totalNotices: dashboardData.totalNotices || 0,
        upcomingEvents: dashboardData.upcomingEvents || 0,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)

      // Prevent crash by setting fallback values
      setStats({
        totalStudents: 0,
        totalEvents: 0,
        totalNotices: 0,
        upcomingEvents: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  // Mock data
  const upcomingEvents = [
    {
      title: 'Tech Fest 2026',
      date: 'Tomorrow • 10:00 AM',
      location: 'Main Auditorium',
    },
    {
      title: 'AI Workshop',
      date: 'Friday • 2:00 PM',
      location: 'Computer Lab',
    },
  ]

  const recentActivities = [
    'New student registration completed',
    'Attendance marked for Computer Science',
    'Sports Day event registration updated',
    'Notice published for semester exams',
  ]

  return (
    <DashboardLayout>
      {/* ================= WELCOME SECTION ================= */}
      <div className='mb-10'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h1 className='text-5xl font-black tracking-tight mb-3'>
              Welcome back, {user?.name || 'Admin'}! 👋
            </h1>

            <p className='text-slate-400 text-lg'>
              Here’s what’s happening in your campus today.
            </p>
          </div>

          <div className='text-right'>
            <p className='text-slate-400 text-sm'>Today</p>

            <p className='text-2xl font-bold'>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Total Students'
          value={loading ? '...' : stats.totalStudents}
          icon={Users}
          gradient='from-blue-500 to-cyan-500'
          change='+12%'
        />

        <StatCard
          title='Active Events'
          value={loading ? '...' : stats.totalEvents}
          icon={Calendar}
          gradient='from-purple-500 to-pink-500'
          change='+8%'
        />

        <StatCard
          title='Attendance Rate'
          value='96%'
          icon={ClipboardCheck}
          gradient='from-green-500 to-emerald-500'
          change='+3%'
        />

        <StatCard
          title='Upcoming Events'
          value={loading ? '...' : stats.upcomingEvents}
          icon={TrendingUp}
          gradient='from-orange-500 to-red-500'
          change='+15%'
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Analytics Section */}
        <div className='xl:col-span-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-2xl font-bold mb-1'>Campus Analytics</h2>
              <p className='text-slate-400'>
                Live overview of campus operations
              </p>
            </div>

            <button className='px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-semibold'>
              View Details
            </button>
          </div>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Attendance Trend */}
            <div className='rounded-2xl bg-white/5 border border-white/10 p-5'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-bold'>Attendance Trend</h3>
                  <p className='text-slate-400 text-sm'>Last 6 months</p>
                </div>

                <div className='px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold'>
                  +8.2%
                </div>
              </div>

              <AttendanceTrendChart />
            </div>

            {/* Progress Ring */}
            <div className='rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 p-5 flex flex-col items-center justify-center'>
              <h3 className='text-lg font-bold mb-6'>
                Campus Goals Progress
              </h3>

              <ProgressRing progress={78} />

              <div className='mt-6 w-full space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-300'>Student Engagement</span>
                  <span className='text-white font-semibold'>82%</span>
                </div>

                <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
                  <div className='h-full w-[82%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full' />
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-slate-300'>Event Participation</span>
                  <span className='text-white font-semibold'>74%</span>
                </div>

                <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
                  <div className='h-full w-[74%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className='rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>Upcoming Events</h2>

            <button className='text-blue-400 hover:text-blue-300 text-sm font-semibold'>
              See all
            </button>
          </div>

          <div className='space-y-4'>
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className='p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all'
              >
                <div className='flex items-start gap-3'>
                  <div className='p-2 rounded-xl bg-blue-500/20'>
                    <Calendar size={18} className='text-blue-400' />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-white mb-2'>
                      {event.title}
                    </h3>

                    <div className='space-y-1 text-sm text-slate-400'>
                      <div className='flex items-center gap-2'>
                        <Clock size={14} />
                        {event.date}
                      </div>

                      <div className='flex items-center gap-2'>
                        <MapPin size={14} />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY + QUICK ACTIONS ================= */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
        {/* Recent Activity */}
        <div className='rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>Recent Activity</h2>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
          </div>

          <div className='space-y-4'>
            {recentActivities.map((activity, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='w-3 h-3 rounded-full bg-blue-400 mt-1.5 flex-shrink-0' />

                <div>
                  <p className='text-white font-medium'>{activity}</p>

                  <p className='text-slate-400 text-sm mt-1'>
                    {index + 1} hour{index !== 0 ? 's' : ''} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6'>
          <h2 className='text-2xl font-bold mb-6'>Quick Actions</h2>

          <div className='grid grid-cols-2 gap-4'>
            <button className='p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 hover:border-blue-400/40 transition-all text-left'>
              <Users size={24} className='text-blue-400 mb-3' />
              <p className='font-semibold'>Add Student</p>
            </button>

            <button className='p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 hover:border-purple-400/40 transition-all text-left'>
              <Calendar size={24} className='text-purple-400 mb-3' />
              <p className='font-semibold'>Create Event</p>
            </button>

            <button className='p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 hover:border-green-400/40 transition-all text-left'>
              <ClipboardCheck size={24} className='text-green-400 mb-3' />
              <p className='font-semibold'>Mark Attendance</p>
            </button>

            <button className='p-5 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 hover:border-orange-400/40 transition-all text-left'>
              <TrendingUp size={24} className='text-orange-400 mb-3' />
              <p className='font-semibold'>View Reports</p>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FINAL ANALYTICS ROW ================= */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8'>
        {/* Department Distribution */}
        <div className='rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold'>Department Distribution</h2>
            <p className='text-slate-400 text-sm mt-1'>
              Student distribution across departments
            </p>
          </div>

          <DepartmentChart />
        </div>

        {/* Event Participation */}
        <div className='rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold'>Event Participation</h2>
            <p className='text-slate-400 text-sm mt-1'>
              Most active campus events
            </p>
          </div>

          <EventParticipationChart />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage