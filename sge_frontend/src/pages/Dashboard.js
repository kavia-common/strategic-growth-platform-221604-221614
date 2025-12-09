import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock Data
const data = [
  { name: 'Jan', value: 4000, active: 2400 },
  { name: 'Feb', value: 3000, active: 1398 },
  { name: 'Mar', value: 2000, active: 9800 },
  { name: 'Apr', value: 2780, active: 3908 },
  { name: 'May', value: 1890, active: 4800 },
  { name: 'Jun', value: 2390, active: 3800 },
  { name: 'Jul', value: 3490, active: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, colorScheme }) => {
  const isPositive = change >= 0;
  
  // Map color schemes to specific Tailwind-like classes defined in App.css
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' } // Fallback
  };
  
  const colors = colorMap[colorScheme] || colorMap.indigo;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex justify-between items-start transition-shadow hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        <div className="flex items-center mt-2 text-sm">
           {isPositive ? (
             <span className="text-emerald-600 flex items-center font-medium">
               <ArrowUpRight size={16} className="mr-1" /> {change}%
             </span>
           ) : (
             <span className="text-red-600 flex items-center font-medium">
               <ArrowDownRight size={16} className="mr-1" /> {Math.abs(change)}%
             </span>
           )}
           <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${colors.bg} ${colors.text}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

// PUBLIC_INTERFACE
const Dashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          change={20.1} 
          icon={DollarSign} 
          colorScheme="indigo" 
        />
        <StatCard 
          title="Active Users" 
          value="2,350" 
          change={15.3} 
          icon={Users} 
          colorScheme="amber" 
        />
        <StatCard 
          title="Growth Rate" 
          value="12.5%" 
          change={-2.4} 
          icon={TrendingUp} 
          colorScheme="red" 
        />
        <StatCard 
          title="Engagement" 
          value="56.2%" 
          change={5.8} 
          icon={Activity} 
          colorScheme="emerald" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#FFFFFF',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                  labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, stroke: '#4F46E5', fill: '#FFFFFF' }}
                  activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Activity</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#FFFFFF',
                    padding: '12px'
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar name="Active Users" dataKey="active" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Total Revenue" dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
