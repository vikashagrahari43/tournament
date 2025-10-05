"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Users, Clock, Calendar, DollarSign, Loader2, AlertCircle, ChevronRight, Target, Award, TrendingUp, Zap, Star, ArrowRight } from 'lucide-react';

interface Participant {
  teamId: string;
  teamName: string;
  joinedAt: Date;
  OwnerEmail: string;
  Matchpoints?: number;
}

interface Tournament {
  _id: string;
  title: string;
  slogan: string;
  prizePool: number;
  entryFee: number;
  maxTeams: number;
  enrolledTeams?: number;
  date: string;
  time: string;
  status: "registering" | "completed" | "full";
  participants?: Participant[];
  RoomId?: string | null;
  RoomPass?: string | null;
}

interface TeamMember {
  name: string;
  bgmiId: number;
  role: string;
}

interface Team {
  _id: string;
  owner: string;
  name: string;
  members: TeamMember[];
  teamid?: string;
  createdby?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function UserHomePage() {
  const router = useRouter();
  
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [totalTournaments, setTotalTournaments] = useState<number>(0);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (upcomingTournament) {
      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(upcomingTournament.date, upcomingTournament.time));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [upcomingTournament]);

  const fetchUserData = async (): Promise<void> => {
    try {
      setLoading(true);

      // Fetch user's tournaments
      const tournamentsResponse = await fetch('/api/tournament/my-tournaments');
      const tournamentsData = await tournamentsResponse.json();

      if (tournamentsResponse.ok && tournamentsData.tournaments) {
        setTotalTournaments(tournamentsData.tournaments.length);
        
        // Find the next upcoming tournament
        const upcoming = tournamentsData.tournaments
          .filter((t: Tournament) => t.status === 'registering' || t.status === 'full')
          .sort((a: Tournament, b: Tournament) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        
        if (upcoming) {
          setUpcomingTournament(upcoming);
          
          // Calculate rank
          if (upcoming.participants) {
            const sorted = [...upcoming.participants].sort((a, b) => 
              (b.Matchpoints || 0) - (a.Matchpoints || 0)
            );
            const userResponse = await fetch('/api/user/me');
            const userData = await userResponse.json();
            if (userData.user?.email) {
              const index = sorted.findIndex(p => p.OwnerEmail === userData.user.email);
              if (index !== -1) setMyRank(index + 1);
            }
          }
        }
      }

      // Fetch user's team
      const userResponse = await fetch('/api/user/me');
      const userData = await userResponse.json();
      
      if (userResponse.ok && userData.user?.teamId) {
        const teamResponse = await fetch(`/api/team/${userData.user.teamId}`);
        const teamData = await teamResponse.json();
        
        if (teamResponse.ok && teamData.team) {
          setMyTeam(teamData.team);
        }
      }

      setError('');
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (dateString: string, timeString: string): TimeRemaining => {
    const tournamentDate = new Date(dateString);
    const now = new Date();
    const total = tournamentDate.getTime() - now.getTime();

    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, total };
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
            Welcome Back, <span className="text-red-600">Champion!</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg">
            {upcomingTournament ? 'Get ready for your next battle' : 'Ready to join your first tournament?'}
          </p>
        </div>

        {/* Upcoming Tournament Countdown */}
        {upcomingTournament ? (
          <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 border-2 border-red-600/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-2xl shadow-red-600/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-red-600/20 rounded-lg">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-red-400 text-xs sm:text-sm font-semibold mb-1">NEXT TOURNAMENT</p>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
                  {upcomingTournament.title}
                </h2>
              </div>
            </div>

            {/* Countdown Timer */}
            {timeRemaining && timeRemaining.total > 0 ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                <div className="bg-black/30 border border-red-600/30 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                    {String(timeRemaining.days).padStart(2, '0')}
                  </p>
                  <p className="text-red-400 text-xs sm:text-sm font-medium">Days</p>
                </div>
                <div className="bg-black/30 border border-red-600/30 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                    {String(timeRemaining.hours).padStart(2, '0')}
                  </p>
                  <p className="text-red-400 text-xs sm:text-sm font-medium">Hours</p>
                </div>
                <div className="bg-black/30 border border-red-600/30 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                    {String(timeRemaining.minutes).padStart(2, '0')}
                  </p>
                  <p className="text-red-400 text-xs sm:text-sm font-medium">Mins</p>
                </div>
                <div className="bg-black/30 border border-red-600/30 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </p>
                  <p className="text-red-400 text-xs sm:text-sm font-medium">Secs</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4 mb-4 sm:mb-6">
                <p className="text-yellow-400 font-semibold text-sm sm:text-base text-center">
                  Tournament starting soon! 🔥
                </p>
              </div>
            )}

            {/* Tournament Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <p className="text-red-400 text-xs mb-1">Prize Pool</p>
                <p className="text-white text-base sm:text-lg md:text-xl font-bold">₹{upcomingTournament.prizePool.toLocaleString()}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <p className="text-red-400 text-xs mb-1">Teams</p>
                <p className="text-white text-base sm:text-lg md:text-xl font-bold">{upcomingTournament.enrolledTeams || 0}/{upcomingTournament.maxTeams}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <p className="text-red-400 text-xs mb-1">Status</p>
                <p className="text-white text-base sm:text-lg md:text-xl font-bold capitalize">{upcomingTournament.status}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <p className="text-red-400 text-xs mb-1">Your Rank</p>
                <p className="text-white text-base sm:text-lg md:text-xl font-bold">{myRank ? `#${myRank}` : 'N/A'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => router.push(`dashboard/leaderboard/${upcomingTournament._id}`)}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                View Leaderboard
              </button>
              <button
                onClick={() => router.push('/dashboard/tournament')}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                All Tournaments
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Upcoming Tournaments</h3>
            <p className="text-zinc-400 text-sm sm:text-base mb-6">Join a tournament to see your countdown here</p>
            <button
              onClick={() => router.push('/dashboard/tournaments')}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-semibold transition-all shadow-lg inline-flex items-center gap-2"
            >
              Browse Tournaments
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* My Team Section */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
                  My Team
                </h2>
                {myTeam && (
                  <button
                    onClick={() => router.push('/dashboard/team')}
                    className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all text-xs sm:text-sm flex items-center gap-2"
                  >
                    Manage Team
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {myTeam ? (
                <>
                  <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 border border-zinc-700">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{myTeam.name}</h3>
                        <p className="text-zinc-400 text-xs sm:text-sm">Team ID: {myTeam.teamid}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-xs sm:text-sm">Members</span>
                      <span className="px-2 sm:px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs sm:text-sm font-bold">
                        {myTeam.members.length}/6
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {myTeam.members.slice(0, 4).map((member, index) => (
                      <div key={index} className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                            <span className="text-red-400 font-bold text-sm sm:text-base">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm sm:text-base truncate">{member.name}</p>
                            <p className="text-zinc-500 text-xs">{member.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {myTeam.members.length > 4 && (
                    <button
                      onClick={() => router.push('/team')}
                      className="w-full mt-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2"
                    >
                      View All {myTeam.members.length} Members
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Team Yet</h3>
                  <p className="text-zinc-400 text-sm sm:text-base mb-6">Create or join a team to participate in tournaments</p>
                  <button
                    onClick={() => router.push('/team/create')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2"
                  >
                    Create Team
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <span className="text-zinc-400 text-sm">Tournaments</span>
                  <span className="text-white font-bold text-lg">{totalTournaments}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <span className="text-zinc-400 text-sm">Team Members</span>
                  <span className="text-white font-bold text-lg">{myTeam?.members.length || 0}</span>
                </div>
                {myRank && (
                  <div className="flex items-center justify-between p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                    <span className="text-yellow-400 text-sm">Current Rank</span>
                    <span className="text-white font-bold text-lg">#{myRank}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/dashboard/tournament')}
                  className="w-full p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-red-600/50 rounded-lg text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-red-500" />
                      <span className="text-white text-sm font-medium">Browse Tournaments</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                <button
                  onClick={() => router.push('/dashboard/leaderboard')}
                  className="w-full p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-600/50 rounded-lg text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-blue-500" />
                      <span className="text-white text-sm font-medium">View Leaderboards</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-600/50 rounded-lg text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className="text-white text-sm font-medium">My Profile</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}