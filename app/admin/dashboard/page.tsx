"use client";
import { Home, Trophy, BarChart3, Calendar, CreditCard, Users, Wallet,  Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const dashboardItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/admin/dashboard', color: 'from-red-500 to-pink-600' },
    { id: 'addtournament', label: 'Add Tournament', icon: Trophy, path: '/admin/dashboard/tournament', color: 'from-orange-500 to-red-600' },
    { id: 'tournament', label: 'Manage Tournament', icon: BarChart3, path: '/admin/dashboard/manageTournament', color: 'from-red-600 to-rose-700' },
    { id: 'room', label: 'Add RoomId', icon: Calendar, path: '/admin/dashboard/roomId', color: 'from-pink-600 to-red-600' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/dashboard/payments', color: 'from-red-500 to-orange-600' },
    { id: 'team', label: 'All Teams', icon: Users, path: '/admin/dashboard/team', color: 'from-rose-600 to-red-700' },
    { id: 'wallet', label: 'All Wallets', icon: Wallet, path: '/admin/dashboard/wallet', color: 'from-red-700 to-pink-700' },
  ];
// can be used any at the place of string
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Admin Control
              </h1>
              <p className="text-gray-400 text-sm mt-1">Tournament Management System</p>
            </div>
          </div>
        </div>

      
        

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {dashboardItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-600/20 transition-all duration-500 text-left overflow-hidden hover:scale-105 cursor-pointer"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className={`mb-6 inline-flex p-4 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {item.label}
                  </h3>

                  {/* Arrow with animation */}
                  <div className="flex items-center text-red-500 font-medium text-sm group-hover:gap-2 transition-all duration-300">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Open</span>
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-600/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Tournament Management System • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}