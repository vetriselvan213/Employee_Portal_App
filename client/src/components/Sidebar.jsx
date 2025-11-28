import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import { LayoutDashboard, Users, UserPlus, LogOut, Building2, Menu, X } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employees', icon: Users, label: 'Employees' },
        ...(user?.role === 'Admin' || user?.role === 'Supervisor'
            ? [{ path: '/employees/add', icon: UserPlus, label: 'Add Employee' }]
            : [])
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gray-900 text-white flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-800
      `}>
                {/* Brand Header */}
                <div className="p-6">
                    <div className="flex items-center space-x-3 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Building2 size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Portal</h1>
                            <p className="text-xs text-gray-400 font-medium tracking-wide">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive(item.path)
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 translate-x-1'
                                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <item.icon className={`mr-3 transition-colors ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} size={20} />
                            <span className="font-medium tracking-wide">{item.label}</span>
                            {isActive(item.path) && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 m-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 font-bold text-lg shadow-lg ring-2 ring-gray-700">
                            {user?.firstName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500/20 w-full py-2.5 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
