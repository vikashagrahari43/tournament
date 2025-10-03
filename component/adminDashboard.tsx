"use client"
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Trophy, 
  Users, 
  BarChart3, 
  Calendar,  
  HelpCircle,
  Menu,
  X,
  Target,
  CreditCard,
  LogOut,
} from 'lucide-react';

const AdminDashboard = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Add logout logic here
    if (window.confirm('Are you sure you want to logout?')) {
      // In a real app, you would clear tokens, redirect to login, etc.
      router.push('/login'); // or wherever your login page is
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'tournament', label: 'Tournament', icon: Trophy, path: '/admin/dashboard/tournament' },
    { id: 'team', label: 'My Team', icon: Users, path: '/admin/dashboard/team' },
    { id: 'stats', label: 'Match Statistics', icon: BarChart3, path: '/admin/dashboard/stats' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/admin/dashboard/schedule' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Target, path: '/admin/dashboard/leaderboard' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/dashboard/payments' },
    { id: 'support', label: 'Support', icon: HelpCircle, path: '/admin/dashboard/support' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 transform transition-transform duration-300 z-50 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-500">GAMING</h1>
              <p className="text-xs text-gray-400">TOURNAMENT</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <nav className="space-y-2 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActivePath(item.path)
                      ? 'bg-red-600 text-white border-l-4 border-red-400' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-gray-700 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 lg:p-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="text-center flex-1 lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-red-500 mb-1">
                TANDAV GAMING
              </h1>
              <p className="text-sm lg:text-base text-gray-400">Battle Royale Championship</p>
            </div>

            {/* Logout button for desktop */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;