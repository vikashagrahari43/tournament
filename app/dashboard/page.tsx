"use client"
import React, { useState, useEffect } from 'react';
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

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Tournament countdown - Set to 2 days from now as example
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(18, 0, 0, 0); // Set to 6:00 PM

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const teamMembers = [
    { name: 'Phoenix', role: 'Leader', avatar: '🔥', kills: 245 },
    { name: 'Shadow', role: 'Sniper', avatar: '🎯', kills: 198 },
    { name: 'Storm', role: 'Assault', avatar: '⚡', kills: 176 },
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
            <>
              {/* Tournament Countdown */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 lg:p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    <Clock className="w-6 h-6 mr-2 text-purple-200" />
                    <h2 className="text-xl lg:text-2xl font-bold">ENROLLED TOURNAMENT</h2>
                  </div>
                  <p className="text-purple-100 mb-4 text-sm lg:text-base">Season 22 Finals starts in:</p>
                  
                  {/* Countdown Display */}
                  <div className="grid grid-cols-4 gap-2 lg:gap-4 mb-4">
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 lg:p-3 text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white">{countdown.days.toString().padStart(2, '0')}</div>
                      <div className="text-xs lg:text-sm text-purple-200">DAYS</div>
                    </div>
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 lg:p-3 text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white">{countdown.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs lg:text-sm text-purple-200">HOURS</div>
                    </div>
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 lg:p-3 text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white">{countdown.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-xs lg:text-sm text-purple-200">MINS</div>
                    </div>
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 lg:p-3 text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white">{countdown.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-xs lg:text-sm text-purple-200">SECS</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-purple-100">
                    <p>🏆 Prize Pool: $50,000</p>
                    <p>📍 Mode: Battle Royale</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 opacity-10">
                  <Trophy className="w-full h-full" />
                </div>
              </div>

              {/* Join Tournament Section */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl lg:text-2xl font-bold mb-2">JOIN NEW TOURNAMENT</h2>
                  <p className="text-red-100 mb-4 text-sm lg:text-base">Compete with the best players worldwide</p>
                  <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    REGISTER NOW
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 opacity-10">
                  <Target className="w-full h-full" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Team Info */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-red-500">MY TEAM</h3>
                    <button 
                      onClick={() => setActiveNav('team')}
                      className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
                    >
                      MY TEAM
                    </button>
                  </div>
                  <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{member.avatar}</span>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-bold text-sm">{member.kills}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    JOIN TEAM
                  </button>
                </div>

                {/* Match Schedule */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-red-500 mb-4">MATCH SCHEDULE</h3>
                  <div className="space-y-3">
                    {matchSchedule.map((match, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <div>
                          <p className="font-medium text-sm">{match.id}</p>
                          <p className="text-xs text-gray-400">{match.map}</p>
                        </div>
                        <span className="text-red-500 font-bold text-sm">{match.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 md:col-span-2 lg:col-span-1">
                  <h3 className="text-lg font-bold text-red-500 mb-4">LEADERBOARD</h3>
                  <div className="space-y-3">
                    {leaderboard.map((team, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{team.badge}</span>
                          <div>
                            <p className="font-medium text-sm">{team.team}</p>
                            <p className="text-xs text-gray-400">Rank #{team.rank}</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-bold text-sm">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl lg:text-3xl font-bold text-red-500 mb-1">24</div>
                  <div className="text-xs lg:text-sm text-gray-400">Active Players</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl lg:text-3xl font-bold text-red-500 mb-1">8</div>
                  <div className="text-xs lg:text-sm text-gray-400">Teams</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl lg:text-3xl font-bold text-red-500 mb-1">15</div>
                  <div className="text-xs lg:text-sm text-gray-400">Matches</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl lg:text-3xl font-bold text-red-500 mb-1">$50K</div>
                  <div className="text-xs lg:text-sm text-gray-400">Prize Pool</div>
                </div>
              </div>
            </>
          )}

          {activeNav === 'team' && (
            <div className="space-y-6">
              {/* Team Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">MY TEAM</h1>
                <p className="text-red-100">Manage your team members and strategy</p>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team Members */}
                <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-6">TEAM MEMBERS</h3>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mr-4">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.role}</p>
                            <p className="text-xs text-red-400">Kills: {member.kills}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                    + ADD NEW MEMBER
                  </button>
                </div>

                {/* Team Stats */}
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-bold text-red-500 mb-4">TEAM STATS</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Kills</span>
                        <span className="font-bold text-red-500">619</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wins</span>
                        <span className="font-bold text-red-500">42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rank</span>
                        <span className="font-bold text-red-500">#7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="font-bold text-red-500">68%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-bold text-red-500 mb-4">RECENT MATCHES</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>vs Thunder Hawks</span>
                        <span className="text-green-500">Win</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>vs Fire Dragons</span>
                        <span className="text-red-500">Loss</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>vs Shadow Wolves</span>
                        <span className="text-green-500">Win</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'tournament' && (
            <div className="space-y-6">
              {/* Tournament Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">TOURNAMENT</h1>
                <p className="text-red-100">Season 22 Championship - Battle for Glory</p>
              </div>

              {/* Tournament Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">TOURNAMENT INFO</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-bold">LIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="text-red-500 font-bold">$50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants:</span>
                      <span className="font-bold">128 Teams</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="font-bold">3 Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span className="font-bold">Battle Royale</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">
                    REGISTER NOW
                  </button>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">TOURNAMENT RULES</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Maximum 4 players per team
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Best of 3 rounds elimination
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      No third-party software allowed
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      All matches streamed live
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Fair play policy enforced
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tournament Brackets */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-red-500 mb-6">TOURNAMENT BRACKETS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <h4 className="font-bold text-red-500 mb-3">QUARTER FINALS</h4>
                    <div className="space-y-2">
                      <div className="bg-gray-800 p-3 rounded text-sm">Fire Dragons vs Ice Wolves</div>
                      <div className="bg-gray-800 p-3 rounded text-sm">Thunder Hawks vs Storm Eagles</div>
                      <div className="bg-gray-800 p-3 rounded text-sm">Shadow Hunters vs Night Raiders</div>
                      <div className="bg-gray-800 p-3 rounded text-sm">Cyber Knights vs Tech Warriors</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-red-500 mb-3">SEMI FINALS</h4>
                    <div className="space-y-2">
                      <div className="bg-gray-700 p-3 rounded text-sm">Fire Dragons vs Thunder Hawks</div>
                      <div className="bg-gray-700 p-3 rounded text-sm">Shadow Hunters vs Cyber Knights</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-red-500 mb-3">FINALS</h4>
                    <div className="bg-red-900 p-3 rounded text-sm">Fire Dragons vs Shadow Hunters</div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-red-500 mb-3">CHAMPION</h4>
                    <div className="bg-yellow-900 p-3 rounded text-sm font-bold">🏆 TBD</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'stats' && (
            <div className="space-y-6">
              {/* Match Statistics Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">MATCH STATISTICS</h1>
                <p className="text-red-100">Detailed performance analytics</p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">127</div>
                  <div className="text-gray-400">Total Kills</div>
                  <div className="text-xs text-green-400 mt-1">↑ +15 this week</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">85%</div>
                  <div className="text-gray-400">Accuracy</div>
                  <div className="text-xs text-green-400 mt-1">↑ +3% this week</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">24</div>
                  <div className="text-gray-400">Matches Played</div>
                  <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">18</div>
                  <div className="text-gray-400">Wins</div>
                  <div className="text-xs text-green-400 mt-1">75% Win Rate</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">WEAPON PERFORMANCE</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>AK-47</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-red-500 font-bold">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>M416</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-red-500 font-bold">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>AWM</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-red-500 font-bold">92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">MAP PERFORMANCE</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Erangel</span>
                      <span className="text-green-400 font-bold">8W - 2L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Miramar</span>
                      <span className="text-green-400 font-bold">6W - 3L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sanhok</span>
                      <span className="text-green-400 font-bold">4W - 1L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'schedule' && (
            <div className="space-y-6">
              {/* Schedule Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">SCHEDULE</h1>
                <p className="text-red-100">Upcoming matches and events</p>
              </div>

              {/* Today's Matches */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-red-500 mb-4">TODAY'S MATCHES</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Quarter Final - Match 1</p>
                      <p className="text-sm text-gray-400">Fire Dragons vs Ice Wolves</p>
                      <p className="text-xs text-red-400">Erangel Classic</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">14:30</p>
                      <p className="text-xs text-gray-400">LIVE</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Quarter Final - Match 2</p>
                      <p className="text-sm text-gray-400">Thunder Hawks vs Storm Eagles</p>
                      <p className="text-xs text-red-400">Miramar Desert</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">16:00</p>
                      <p className="text-xs text-gray-400">Upcoming</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-red-500 mb-4">THIS WEEK</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">Tuesday</h4>
                    <p className="text-sm">Semi Finals</p>
                    <p className="text-xs text-gray-400">18:00 - 20:00</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">Thursday</h4>
                    <p className="text-sm">Finals</p>
                    <p className="text-xs text-gray-400">19:00 - 21:00</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">Sunday</h4>
                    <p className="text-sm">Grand Finals</p>
                    <p className="text-xs text-gray-400">20:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'leaderboard' && (
            <div className="space-y-6">
              {/* Leaderboard Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">LEADERBOARD</h1>
                <p className="text-red-100">Top teams and players rankings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Rankings */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">TEAM RANKINGS</h3>
                  <div className="space-y-3">
                    {[
                      {rank: 1, name: 'Fire Dragons', points: 2850, badge: '🏆'},
                      {rank: 2, name: 'Shadow Wolves', points: 2756, badge: '🥈'},
                      {rank: 3, name: 'Thunder Hawks', points: 2691, badge: '🥉'},
                      {rank: 4, name: 'Ice Warriors', points: 2543, badge: '4️⃣'},
                      {rank: 5, name: 'Storm Eagles', points: 2398, badge: '5️⃣'},
                    ].map((team, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{team.badge}</span>
                          <div>
                            <p className="font-bold">{team.name}</p>
                            <p className="text-xs text-gray-400">Rank #{team.rank}</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-bold">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player Rankings */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">TOP PLAYERS</h3>
                  <div className="space-y-3">
                    {[
                      {rank: 1, name: 'DragonSlayer', team: 'Fire Dragons', kills: 245},
                      {rank: 2, name: 'ShadowHunter', team: 'Shadow Wolves', kills: 232},
                      {rank: 3, name: 'ThunderStrike', team: 'Thunder Hawks', kills: 218},
                      {rank: 4, name: 'IceBreaker', team: 'Ice Warriors', kills: 205},
                      {rank: 5, name: 'StormRider', team: 'Storm Eagles', kills: 198},
                    ].map((player, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <div>
                          <p className="font-bold text-sm">{player.name}</p>
                          <p className="text-xs text-gray-400">{player.team}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-red-500 font-bold">{player.kills}</span>
                          <p className="text-xs text-gray-400">kills</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'payments' && (
            <div className="space-y-6">
              {/* Payments Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">PAYMENTS</h1>
                <p className="text-green-100">Manage your tournament fees and earnings</p>
              </div>

              {/* Account Balance */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-green-500 mb-2">WALLET BALANCE</h3>
                    <div className="text-3xl font-bold text-white mb-1">$1,250.00</div>
                    <div className="text-sm text-gray-400">Available Balance</div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-blue-500 mb-2">TOTAL EARNINGS</h3>
                    <div className="text-3xl font-bold text-white mb-1">$8,750.00</div>
                    <div className="text-sm text-gray-400">All Time</div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-orange-500 mb-2">PENDING PAYOUTS</h3>
                    <div className="text-3xl font-bold text-white mb-1">$450.00</div>
                    <div className="text-sm text-gray-400">Processing</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-green-500 mb-4">PAYMENT METHODS</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="font-bold">•••• •••• •••• 4532</p>
                          <p className="text-xs text-gray-400">Expires 12/26</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-orange-600 rounded flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">MC</span>
                        </div>
                        <div>
                          <p className="font-bold">•••• •••• •••• 8901</p>
                          <p className="text-xs text-gray-400">Expires 08/25</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                      + ADD NEW PAYMENT METHOD
                    </button>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-green-500 mb-4">RECENT TRANSACTIONS</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">+</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Tournament Win</p>
                          <p className="text-xs text-gray-400">Sept 14, 2024</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">+$450.00</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">-</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Entry Fee</p>
                          <p className="text-xs text-gray-400">Sept 12, 2024</p>
                        </div>
                      </div>
                      <span className="text-red-400 font-bold">-$50.00</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">+</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Prize Money</p>
                          <p className="text-xs text-gray-400">Sept 10, 2024</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">+$1200.00</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">$</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Wallet Deposit</p>
                          <p className="text-xs text-gray-400">Sept 8, 2024</p>
                        </div>
                      </div>
                      <span className="text-blue-400 font-bold">+$500.00</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600">
                    VIEW ALL TRANSACTIONS
                  </button>
                </div>
              </div>

              {/* Tournament Fees */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-green-500 mb-4">UPCOMING TOURNAMENT FEES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Season 22 Finals</h4>
                    <p className="text-sm text-gray-400 mb-3">Entry Fee Required</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-red-400">$100.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Due:</span>
                      <span className="text-yellow-400">2 days</span>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      PAY NOW
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Premium League</h4>
                    <p className="text-sm text-gray-400 mb-3">Monthly Subscription</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-red-400">$25.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Due:</span>
                      <span className="text-yellow-400">7 days</span>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      PAY NOW
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Team Registration</h4>
                    <p className="text-sm text-gray-400 mb-3">Annual Team Fee</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-green-400">PAID</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Valid Until:</span>
                      <span className="text-green-400">Dec 2024</span>
                    </div>
                    <button className="w-full bg-gray-600 text-gray-400 py-2 rounded cursor-not-allowed" disabled>
                      PAID
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-green-500 mb-4">QUICK ACTIONS</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">💳</div>
                    <p className="font-bold text-sm">Add Funds</p>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="font-bold text-sm">Withdraw</p>
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="font-bold text-sm">Statement</p>
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">🎫</div>
                    <p className="font-bold text-sm">Refunds</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'support' && (
            <div className="space-y-6">
              {/* Support Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">SUPPORT</h1>
                <p className="text-red-100">Get help and report issues</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Options */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">CONTACT US</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💬</span>
                        <div>
                          <p className="font-bold">Live Chat</p>
                          <p className="text-sm text-gray-400">Get instant help</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📧</span>
                        <div>
                          <p className="font-bold">Email Support</p>
                          <p className="text-sm text-gray-400">support@gaming.com</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🐛</span>
                        <div>
                          <p className="font-bold">Report Bug</p>
                          <p className="text-sm text-gray-400">Help us improve</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">FREQUENTLY ASKED</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="font-bold text-sm">How to register for tournaments?</p>
                      <p className="text-xs text-gray-400 mt-1">Click on Tournament page and hit Register Now</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="font-bold text-sm">How to join a team?</p>
                      <p className="text-xs text-gray-400 mt-1">Go to My Team section and create or join existing teams</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="font-bold text-sm">Tournament schedule?</p>
                      <p className="text-xs text-gray-400 mt-1">Check Schedule page for all upcoming matches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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