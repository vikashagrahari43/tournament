"use client"
import { Clock, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeDas() {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
        const teamMembers = [
        { name: 'Phoenix', role: 'Leader', avatar: '🔥', kills: 245 },
        { name: 'Shadow', role: 'Sniper', avatar: '🎯', kills: 198 },
        { name: 'Storm', role: 'Assault', avatar: '⚡', kills: 176 },
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
  return (
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
  )
}
