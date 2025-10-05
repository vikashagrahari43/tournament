"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight, AlertCircle, Loader2, Calendar, DollarSign, Users, TrendingUp, Award, Package } from 'lucide-react';

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

export default function UserLeaderboardList() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  const fetchMyTournaments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/tournament/my-tournaments');
      const data = await response.json();

      if (response.ok) {
        setTournaments(data.tournaments || []);
        setError('');
      } else {
        setError(data.error || 'Failed to load your tournaments');
      }
    } catch (err) {
      setError('An error occurred while fetching tournaments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleTournamentClick = (tournamentId: string) => {
    router.push(`/dashboard/leaderboard/${tournamentId}`);
  };

  const getStatusBadge = (status: Tournament['status']) => {
    const styles = {
      registering: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      full: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      completed: 'bg-green-500/20 text-green-400 border-green-500/50'
    };
    
    const labels = {
      registering: 'Upcoming',
      full: 'In Progress',
      completed: 'Completed'
    };

    const icons = {
      registering: <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />,
      full: <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />,
      completed: <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getMyRank = (tournament: Tournament, userEmail?: string): { rank: number; points: number } | null => {
    if (!tournament.participants) return null;
    
    const sorted = [...tournament.participants].sort((a, b) => 
      (b.Matchpoints || 0) - (a.Matchpoints || 0)
    );
    
    const myTeamIndex = sorted.findIndex(p => p.OwnerEmail === userEmail);
    if (myTeamIndex === -1) return null;
    
    return {
      rank: myTeamIndex + 1,
      points: sorted[myTeamIndex].Matchpoints || 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text  px-4">
            Tournament <span className="text-red-600">Leaderboards</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg px-4 max-w-2xl mx-auto">
            Check your rankings and compete with other teams
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl flex items-start max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm sm:text-base">Error</p>
              <p className="text-red-300 text-xs sm:text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {tournaments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-red-600/30 transition-colors">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{tournaments.length}</p>
              <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1">Tournaments</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-green-600/30 transition-colors">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1">Completed</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-blue-600/30 transition-colors col-span-2 sm:col-span-1">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'full').length}
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1">In Progress</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {tournaments.length === 0 && !error ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-flex items-center justify-center p-6 sm:p-8 bg-zinc-900 rounded-3xl border border-zinc-800 mb-4 sm:mb-6">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-zinc-700" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Tournaments Yet</h3>
            <p className="text-zinc-500 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
              You haven't enrolled in any tournaments yet. Join a tournament to see leaderboards!
            </p>
            <button
              onClick={() => router.push('/dashboard/tournament')}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 text-sm sm:text-base"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {tournaments.map((tournament) => {
              const myRank = getMyRank(tournament);
              return (
                <button
                  key={tournament._id}
                  onClick={() => handleTournamentClick(tournament._id)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 text-left group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-red-600/10 to-red-800/10 p-4 sm:p-5 md:p-6 border-b border-zinc-800">
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white line-clamp-2 flex-1 pr-2">
                        {tournament.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                    <p className="text-red-400 text-xs sm:text-sm line-clamp-2 italic">
                      {tournament.slogan}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    {/* My Rank Highlight */}
                    {myRank && (
                      <div className={`rounded-lg p-3 sm:p-4 border-2 ${
                        myRank.rank === 1 ? 'bg-yellow-600/20 border-yellow-600/50' :
                        myRank.rank === 2 ? 'bg-zinc-400/20 border-zinc-400/50' :
                        myRank.rank === 3 ? 'bg-orange-600/20 border-orange-600/50' :
                        'bg-blue-600/10 border-blue-600/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {myRank.rank <= 3 ? (
                              <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                myRank.rank === 1 ? 'text-yellow-500' :
                                myRank.rank === 2 ? 'text-zinc-400' :
                                'text-orange-600'
                              }`} />
                            ) : (
                              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                            )}
                            <div>
                              <p className={`text-xs ${
                                myRank.rank === 1 ? 'text-yellow-400' :
                                myRank.rank === 2 ? 'text-zinc-400' :
                                myRank.rank === 3 ? 'text-orange-400' :
                                'text-blue-400'
                              }`}>Your Rank</p>
                              <p className="text-white font-bold text-lg sm:text-xl">#{myRank.rank}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-zinc-400 text-xs">Points</p>
                            <p className="text-white font-bold text-lg sm:text-xl">{myRank.points}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Prize Pool */}
                    <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 border border-red-600/20 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
                          <span className="text-red-400 text-xs sm:text-sm font-medium">Prize Pool</span>
                        </div>
                        <span className="text-white font-bold text-base sm:text-lg md:text-xl">
                          ₹{tournament.prizePool.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Teams Count */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center text-zinc-400">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        <span>Total Teams</span>
                      </div>
                      <span className="text-white font-semibold">
                        {tournament.enrolledTeams || 0}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-zinc-800">
                      <div className="flex items-center text-zinc-400">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-red-500" />
                        <span>{formatDate(tournament.date)}</span>
                      </div>
                      <span className="text-zinc-400">{tournament.time}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-2">
                      {getStatusBadge(tournament.status)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}