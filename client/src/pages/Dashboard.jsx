import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Users, Briefcase, Clock, TrendingUp, ArrowUpRight, MoreHorizontal } from 'lucide-react';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    // Role-based stats
    const getStatsForRole = () => {
        if (user?.role === 'Admin') {
            return [
                { title: 'Total Employees', value: '120', change: '+12%', icon: Users, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
                { title: 'Active Projects', value: '8', change: '+3', icon: Briefcase, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
                { title: 'Pending Reviews', value: '3', change: '-2', icon: Clock, gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
            ];
        } else if (user?.role === 'Supervisor') {
            return [
                { title: 'Team Members', value: '15', change: '+2', icon: Users, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
                { title: 'Active Tasks', value: '5', change: '+1', icon: Briefcase, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
                { title: 'Pending Approvals', value: '2', change: '0', icon: Clock, gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
            ];
        } else {
            return [
                { title: 'My Tasks', value: '8', change: '+2', icon: Briefcase, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
                { title: 'Completed', value: '12', change: '+3', icon: TrendingUp, gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            ];
        }
    };

    const stats = getStatsForRole();

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* Welcome Section */}
                    <div className="mb-8 animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.firstName}! 👋
                        </h2>
                        <p className="text-gray-500">
                            {user?.role === 'Admin' && "Here's what's happening with your organization today."}
                            {user?.role === 'Supervisor' && "Here's an overview of your team's activity."}
                            {user?.role === 'Employee' && "Here's your personal dashboard overview."}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="text-white" size={28} />
                                </div>
                                <div className={`flex items-center px-2.5 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : stat.change.startsWith('-') ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'} text-sm font-semibold`}>
                                    {stat.change.startsWith('+') ? <TrendingUp size={16} className="mr-1" /> : stat.change.startsWith('-') ? <TrendingUp size={16} className="mr-1 rotate-180" /> : null}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            {/* Decorative background blob */}
                            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${stat.gradient} blur-2xl group-hover:opacity-20 transition-opacity`} />
                        </div>
                    ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                                <p className="text-sm text-gray-500 mt-1">Latest updates from your team</p>
                            </div>
                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'John Doe', action: 'New employee added', time: '2 hours ago', color: 'from-blue-500 to-indigo-600', initials: 'JD' },
                                { name: 'Jane Smith', action: 'Profile updated', time: '4 hours ago', color: 'from-purple-500 to-pink-600', initials: 'JS' },
                                { name: 'Mike Johnson', action: 'Department changed', time: '6 hours ago', color: 'from-green-500 to-emerald-600', initials: 'MJ' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center group p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold mr-4 shadow-md group-hover:scale-105 transition-transform`}>
                                        {item.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{item.action}</p>
                                        <p className="text-sm text-gray-500">by <span className="text-gray-700 font-medium">{item.name}</span> • {item.time}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 transition-all">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
