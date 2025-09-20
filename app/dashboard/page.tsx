"use client"
import React, { useState, useEffect } from 'react';
import HomeDas from "../../component/HomeDas"
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
  Clock
} from 'lucide-react';
import TournamentDas from '@/component/TournamentDas';
import MainTeam from '@/component/MainTeam';
import StaticsDas from '@/component/StaticsDas';
import ScheduleDas from '@/component/ScheduleDas';
import LeaderboardDas from '@/component/LeaderboardDas';
import PaymentDas from '@/component/PaymentDas';
import SupportDas from '@/component/SupportDas';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  // const [countdown, setCountdown] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0
  // });

  // Tournament countdown - Set to 2 days from now as example
  // useEffect(() => {
  //   const targetDate = new Date();
  //   targetDate.setDate(targetDate.getDate() + 2);
  //   targetDate.setHours(18, 0, 0, 0); // Set to 6:00 PM

  //   const timer = setInterval(() => {
  //     const now = new Date().getTime();
  //     const distance = targetDate.getTime() - now;

  //     if (distance > 0) {
  //       setCountdown({
  //         days: Math.floor(distance / (1000 * 60 * 60 * 24)),
  //         hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  //         minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
  //         seconds: Math.floor((distance % (1000 * 60)) / 1000)
  //       });
  //     } else {
  //       setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  //     }
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  const handleLogout = () => {
    // Add logout logic here
    if (window.confirm('Are you sure you want to logout?')) {
      // In a real app, you would clear tokens, redirect to login, etc.
      alert('Logged out successfully!');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tournament', label: 'Tournament', icon: Trophy },
    { id: 'team', label: 'My Team', icon: Users },
    { id: 'stats', label: 'Match Statistics', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'leaderboard', label: 'Leaderboard', icon: Target },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const matchSchedule = [
    { id: 'Edit 13', map: 'Sanhok World 1', time: '14:30' },
    { id: 'Edit 12', map: 'Erangel World 3', time: '15:15' },
    { id: 'Edit 14', map: 'Miramar Desert', time: '16:00' },
  ];

  

  const leaderboard = [
    { rank: 1, team: 'Fire Dragons', points: 2840, badge: '🏆' },
    { rank: 2, team: 'Shadow Wolves', points: 2756, badge: '🥈' },
    { rank: 3, team: 'Thunder Hawks', points: 2691, badge: '🥉' },
  ];

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
                  onClick={() => {
                    setActiveNav(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeNav === item.id 
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
          {activeNav === 'home' && (
            <HomeDas />
          )}

          {activeNav === 'team' && (
            <MainTeam />
          )}

          {activeNav === 'tournament' && (
           <TournamentDas />
          )}

          {activeNav === 'stats' && (
           < StaticsDas />
          )}

          {activeNav === 'schedule' && (
            <ScheduleDas />
          )}

          {activeNav === 'leaderboard' && (
            < LeaderboardDas />
          )}

          {activeNav === 'payments' && (
           < PaymentDas />
          )}

          {activeNav === 'support' && (
            <SupportDas />
          )}

          {activeNav !== 'home' && activeNav !== 'team' && activeNav !== 'tournament' && 
           activeNav !== 'stats' && activeNav !== 'schedule' && activeNav !== 'leaderboard' && 
           activeNav !== 'payments' && activeNav !== 'support' && (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Coming Soon</h2>
              <p className="text-gray-400">This section is under development</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;