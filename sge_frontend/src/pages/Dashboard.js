import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

// Mock data generators
const productivityData = [
  { day: 'Mon', value: 5 },
  { day: 'Tue', value: 7 },
  { day: 'Wed', value: 9 },
  { day: 'Thu', value: 10 },
  { day: 'Fri', value: 8 },
  { day: 'Sat', value: 6 },
  { day: 'Sun', value: 11 }
];

const workloadData = [
  { team: 'Design', value: 380 },
  { team: 'Backend', value: 420 },
  { team: 'Frontend', value: 450 },
  { team: 'Testing', value: 320 }
];

const taskStatusData = [
  { name: 'Completed', value: 45, color: '#10B981' },
  { name: 'In Progress', value: 30, color: '#2563EB' },
  { name: 'Pending', value: 15, color: '#F59E0B' },
  { name: 'Blocked', value: 10, color: '#EF4444' }
];

const recentSessions = [
  { name: 'Strategy Review', project: 'Project Alpha', owner: 'John D', status: '12:30 PM' },
  { name: 'Risk Analysis', project: 'Project Beta', owner: 'Sarah K', status: '10:15 AM' },
  { name: 'Market Research', project: 'Project Gamma', owner: 'Mike R', status: 'Yesterday' }
];

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}15` }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </div>
);

// PUBLIC_INTERFACE
/**
 * Dashboard Component
 * Main analytics dashboard with fixed narrow sidebar, stats cards, charts, and tables
 * Uses Ocean Professional theme (Blue #2563EB primary, Amber #F59E0B secondary)
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Narrow Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 z-50">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ml-16 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Updated 5 min ago</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid - 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value="128" icon={Users} color="#2563EB" />
              <StatCard title="Running Sessions" value="5" icon={Activity} color="#10B981" />
              <StatCard title="Tasks Completed" value="42" icon={TrendingUp} color="#8B5CF6" />
              <StatCard title="Revenue" value="$12.5K" icon={DollarSign} color="#F59E0B" />
            </div>

            {/* Charts Row - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Productivity Line Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Over Last 7 Days</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2563EB" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#2563EB' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Workload Bar Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload by Team</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="team" 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#2563EB" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row - Table and Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sessions Table */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Session Name</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Project</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Owner</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentSessions.map((session, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 text-sm text-gray-900 font-medium">{session.name}</td>
                          <td className="py-3 text-sm text-gray-700">{session.project}</td>
                          <td className="py-3 text-sm text-gray-700">{session.owner}</td>
                          <td className="py-3 text-sm text-gray-500">{session.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Task Status Pie Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: '#374151', fontSize: '14px' }}>
                            {value} ({entry.payload.value}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
