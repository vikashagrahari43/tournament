"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, DollarSign, Users, Crown, AlertCircle, Loader2, CheckCircle, XCircle, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  participants?: Array<{
    teamId: string;
    teamName: string;
    joinedAt: Date;
    OwnerEmail: string;
    Matchpoints?: number;
  }>;
  RoomId?: string | null;
  RoomPass?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function MyTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const router = useRouter();
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

  const getStatusBadge = (status: Tournament['status']) => {
    const styles: Record<Tournament['status'], string> = {
      registering: 'bg-green-500/20 text-green-400 border-green-500/50',
      full: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    
    const labels: Record<Tournament['status'], string> = {
      registering: 'Registered',
      full: 'In Progress',
      completed: 'Completed'
    };

    const icons = {
      registering: <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />,
      full: <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />,
      completed: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
    };

    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatJoinedDate = (dateString: Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMyTeamInfo = (tournament: Tournament, userEmail?: string) => {
    return tournament.participants?.find(p => p.OwnerEmail === userEmail);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-lg">Loading your tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text ">
            My <span className="text-red-600">Tournaments</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 mb-2">
            Track all your enrolled tournaments, match details, and room credentials
          </p>
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto px-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          </div>
          <p className="text-yellow-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4 mt-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg py-2 inline-block">
            Room and Password will be updated by admin before the tournament starts
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {tournaments.length === 0 && !error ? (
          <div className="text-center py-12 sm:py-20">
            <div className="inline-flex items-center justify-center p-6 sm:p-8 bg-zinc-900 rounded-3xl border border-zinc-800 mb-6">
              <Package className="w-16 h-16 sm:w-20 sm:h-20 text-zinc-700" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Tournaments Yet</h3>
            <p className="text-zinc-500 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
              You haven't enrolled in any tournaments yet. Browse available tournaments and join one to get started!
            </p>
            <button
              onClick={() => router.push('/dashboard/tournament')}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 cursor-pointer"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">{tournaments.length}</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm">Total Enrolled</p>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {tournaments.filter(t => t.status === 'registering').length}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm">Registered</p>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {tournaments.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm">Completed</p>
              </div>
            </div>

            {/* Tournaments List */}
            <div className="space-y-4 sm:space-y-6">
              {tournaments.map((tournament) => {
                const myTeam = getMyTeamInfo(tournament);
                return (
                  <div
                    key={tournament._id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300"
                  >
                    {/* Tournament Header */}
                    <div className="bg-gradient-to-r from-red-600/10 to-red-800/10 p-4 sm:p-6 border-b border-zinc-800">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-1" />
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">
                              {tournament.title}
                            </h3>
                          </div>
                          <p className="text-red-400 text-xs sm:text-sm italic line-clamp-2">
                            {tournament.slogan}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(tournament.status)}
                        </div>
                      </div>
                    </div>

                    {/* Tournament Details Grid */}
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {/* Prize Pool */}
                        <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 border border-red-600/20 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
                            <span className="text-red-400 text-xs sm:text-sm font-medium">Prize Pool</span>
                          </div>
                          <p className="text-white text-lg sm:text-xl font-bold">
                            ₹{tournament.prizePool.toLocaleString()}
                          </p>
                        </div>

                        {/* Entry Fee */}
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-2" />
                            <span className="text-zinc-400 text-xs sm:text-sm font-medium">Entry Fee Paid</span>
                          </div>
                          <p className="text-white text-lg sm:text-xl font-bold">₹{tournament.entryFee}</p>
                        </div>

                        {/* Teams Enrolled */}
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-2" />
                            <span className="text-zinc-400 text-xs sm:text-sm font-medium">Teams</span>
                          </div>
                          <p className="text-white text-lg sm:text-xl font-bold">
                            {tournament.enrolledTeams || 0}/{tournament.maxTeams}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-2" />
                            <span className="text-zinc-400 text-xs sm:text-sm font-medium">Date</span>
                          </div>
                          <p className="text-white text-sm sm:text-base font-semibold">
                            {formatDate(tournament.date)}
                          </p>
                        </div>

                        {/* Time */}
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-2" />
                            <span className="text-zinc-400 text-xs sm:text-sm font-medium">Time</span>
                          </div>
                          <p className="text-white text-sm sm:text-base font-semibold">{tournament.time}</p>
                        </div>

                        {/* Joined Date */}
                        {myTeam && (
                          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                              <span className="text-zinc-400 text-xs sm:text-sm font-medium">Joined</span>
                            </div>
                            <p className="text-white text-sm sm:text-base font-semibold">
                              {formatJoinedDate(myTeam.joinedAt)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* My Team Info */}
                      {myTeam && (
                        <div className="bg-gradient-to-r from-green-600/10 to-green-800/10 border border-green-600/20 rounded-lg p-3 sm:p-4 mb-4">
                          <h4 className="text-green-400 font-semibold text-sm sm:text-base mb-2 flex items-center">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Your Team
                          </h4>
                          <p className="text-white font-bold text-base sm:text-lg">{myTeam.teamName}</p>
                          {myTeam.Matchpoints !== undefined && (
                            <p className="text-green-300 text-xs sm:text-sm mt-1">
                              Match Points: <span className="font-bold">{myTeam.Matchpoints}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Room Credentials */}
                      {/* {tournament.RoomId && tournament.RoomPass && ( */}
                        <div className="bg-gradient-to-r from-blue-600/10 to-blue-800/10 border border-blue-600/20 rounded-lg p-3 sm:p-4">
                          <h4 className="text-blue-400 font-semibold text-sm sm:text-base mb-3 flex items-center">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Room Credentials
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">Room ID</p>
                              <p className="text-white font-mono text-sm sm:text-base bg-zinc-800/50 px-3 py-2 rounded border border-zinc-700">
                                {tournament.RoomId || 'Not Updated Yet'} 
                              </p>
                            </div>
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">Room Password</p>
                              <p className="text-white font-mono text-sm sm:text-base bg-zinc-800/50 px-3 py-2 rounded border border-zinc-700">
                                {tournament.RoomPass || 'Not Updated Yet'}
                              </p>
                            </div>
                          </div>
                        </div>
                      {/* )} */}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}