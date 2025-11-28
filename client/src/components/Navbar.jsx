import React from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
    return (
        <div className="sticky top-0 z-30 h-20 glass flex items-center justify-between px-6 lg:px-10 transition-all duration-300">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
                    <Bell size={22} className="text-gray-600" />
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;
