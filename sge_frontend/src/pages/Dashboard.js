import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

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

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="card flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className={`text-sm mt-2 font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? '+' : ''}{change}% from last month
      </p>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
      <Icon size={24} color={color === 'blue' ? '#2563EB' : (color === 'amber' ? '#F59E0B' : '#10B981')} />
    </div>
  </div>
);

// PUBLIC_INTERFACE
const Dashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231.89" change={20.1} icon={DollarSign} color="blue" />
        <StatCard title="Active Users" value="2,350" change={15.3} icon={Users} color="amber" />
        <StatCard title="Growth Rate" value="12.5%" change={-2.4} icon={TrendingUp} color="red" />
        <StatCard title="Engagement" value="56.2%" change={5.8} icon={Activity} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Activity</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="active" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
