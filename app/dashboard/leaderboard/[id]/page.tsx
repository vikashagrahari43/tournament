"use client";
import React, {JSX} from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Trophy, ArrowLeft, AlertCircle, Loader2, Crown, TrendingUp, Users, DollarSign, Calendar, Clock, Medal, Award, Target } from 'lucide-react';

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

interface RankedParticipant extends Participant {
  rank: number;
}

export default function LeaderboardDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentDetails();
      fetchUserEmail();
    }
  }, [tournamentId]);

  const fetchTournamentDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tournament/${tournamentId}`);
      const data = await response.json();

      if (response.ok && data.tournament) {
        setTournament(data.tournament);
        setError('');
      } else {
        setError(data.error || 'Failed to load tournament');
      }
    } catch (err) {
      setError('An error occurred while fetching tournament');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEmail = async (): Promise<void> => {
    try {
      const response = await fetch('/api/user/me');
      const data = await response.json();
      if (response.ok && data.user?.email) {
        setUserEmail(data.user.email);
      }
    } catch (err) {
      console.error('Failed to fetch user email');
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

  const getRankedParticipants = (): RankedParticipant[] => {
    if (!tournament?.participants) return [];
    
    const sorted = [...tournament.participants].sort((a, b) => 
      (b.Matchpoints || 0) - (a.Matchpoints || 0)
    );
    
    return sorted.map((participant, index) => ({
      ...participant,
      rank: index + 1
    }));
  };

  const getTopThree = (): RankedParticipant[] => {
    return getRankedParticipants().slice(0, 3);
  };

  const getRankBadgeStyle = (rank: number): string => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-white shadow-lg shadow-yellow-500/50';
    if (rank === 2) return 'bg-gradient-to-br from-zinc-300 to-zinc-500 text-black shadow-lg shadow-zinc-400/50';
    if (rank === 3) return 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/50';
    return 'bg-zinc-700 text-zinc-300';
  };

  const getRankIcon = (rank: number): JSX.Element => {
    if (rank === 1) return <Crown className="w-5 h-5 sm:w-6 sm:h-6" />;
    if (rank === 2) return <Medal className="w-5 h-5 sm:w-6 sm:h-6" />;
    if (rank === 3) return <Award className="w-5 h-5 sm:w-6 sm:h-6" />;
    return <Target className="w-5 h-5 sm:w-6 sm:h-6" />;
  };

  const isMyTeam = (participant: Participant): boolean => {
    return participant.OwnerEmail === userEmail;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Tournament Not Found</h2>
          <p className="text-zinc-400 text-sm sm:text-base mb-6">{error || 'Unable to load leaderboard'}</p>
          <button
            onClick={() => router.push('/dashboard/leaderboard')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base cursor-pointer"
          >
            Back to Leaderboards
          </button>
        </div>
      </div>
    );
  }

  const rankedParticipants = getRankedParticipants();
  const topThree = getTopThree();
  const restOfParticipants = rankedParticipants.slice(3);

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/leaderboard')}
          className="mb-4 sm:mb-6 flex items-center text-zinc-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Leaderboards</span>
        </button>

        {/* Tournament Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-red-600/10 rounded-xl border border-red-600/20">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 break-words">
                {tournament.title}
              </h1>
              <p className="text-red-400 text-sm sm:text-base md:text-lg italic">{tournament.slogan}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Prize Pool</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg md:text-xl">₹{tournament.prizePool.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Teams</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg md:text-xl">{tournament.enrolledTeams || 0}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Date</p>
              </div>
              <p className="text-white font-bold text-sm sm:text-base">{formatDate(tournament.date)}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Time</p>
              </div>
              <p className="text-white font-bold text-sm sm:text-base">{tournament.time}</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-yellow-500" />
              Top 3 Champions
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="sm:order-1 order-2">
                  <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center ${
                    isMyTeam(topThree[1]) ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-zinc-600'
                  }`}>
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-zinc-300 to-zinc-500 rounded-full flex items-center justify-center shadow-lg shadow-zinc-400/50">
                        <Medal className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black" />
                      </div>
                    </div>
                    <div className="mb-2 sm:mb-3">
                      <span className="inline-block px-3 sm:px-4 py-1 bg-zinc-600 text-white rounded-full text-xs sm:text-sm font-bold">
                        2nd Place
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 break-words">
                      {topThree[1].teamName}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-3 truncate">{topThree[1].OwnerEmail}</p>
                    <div className="bg-zinc-700/50 rounded-lg p-2 sm:p-3">
                      <p className="text-zinc-400 text-xs">Match Points</p>
                      <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{topThree[1].Matchpoints || 0}</p>
                    </div>
                    {isMyTeam(topThree[1]) && (
                      <div className="mt-3 px-3 py-1.5 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                        <p className="text-blue-400 text-xs sm:text-sm font-semibold">Your Team</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="sm:order-2 order-1">
                  <div className={`bg-gradient-to-br from-yellow-900/30 to-yellow-950/50 border-2 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center transform sm:scale-110 ${
                    isMyTeam(topThree[0]) ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-yellow-600'
                  }`}>
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
                        <Crown className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                      </div>
                    </div>
                    <div className="mb-2 sm:mb-3">
                      <span className="inline-block px-4 sm:px-5 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full text-sm sm:text-base font-bold shadow-lg">
                        🏆 Champion
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 break-words">
                      {topThree[0].teamName}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-3 truncate">{topThree[0].OwnerEmail}</p>
                    <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-2 sm:p-3">
                      <p className="text-yellow-400 text-xs">Match Points</p>
                      <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">{topThree[0].Matchpoints || 0}</p>
                    </div>
                    {isMyTeam(topThree[0]) && (
                      <div className="mt-3 px-3 py-1.5 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                        <p className="text-blue-400 text-xs sm:text-sm font-semibold">Your Team</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="sm:order-3 order-3">
                  <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center ${
                    isMyTeam(topThree[2]) ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-orange-600'
                  }`}>
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                        <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                      </div>
                    </div>
                    <div className="mb-2 sm:mb-3">
                      <span className="inline-block px-3 sm:px-4 py-1 bg-orange-700 text-white rounded-full text-xs sm:text-sm font-bold">
                        3rd Place
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 break-words">
                      {topThree[2].teamName}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-3 truncate">{topThree[2].OwnerEmail}</p>
                    <div className="bg-zinc-700/50 rounded-lg p-2 sm:p-3">
                      <p className="text-zinc-400 text-xs">Match Points</p>
                      <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{topThree[2].Matchpoints || 0}</p>
                    </div>
                    {isMyTeam(topThree[2]) && (
                      <div className="mt-3 px-3 py-1.5 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                        <p className="text-blue-400 text-xs sm:text-sm font-semibold">Your Team</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-red-500" />
            Full Leaderboard
          </h2>

          {rankedParticipants.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-sm sm:text-base">No teams enrolled yet</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {rankedParticipants.map((participant) => (
                <div
                  key={participant.teamId}
                  className={`rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all ${
                    isMyTeam(participant)
                      ? 'bg-blue-600/20 border-2 border-blue-500 ring-2 ring-blue-500/30'
                      : 'bg-zinc-800/50 border border-zinc-700 hover:border-red-600/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                      {/* Rank Badge */}
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg ${getRankBadgeStyle(participant.rank)}`}>
                        {participant.rank <= 3 ? getRankIcon(participant.rank) : `#${participant.rank}`}
                      </div>

                      {/* Team Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                            {participant.teamName}
                          </h3>
                          {isMyTeam(participant) && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-semibold">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 text-xs sm:text-sm truncate">{participant.OwnerEmail}</p>
                      </div>

                      {/* Match Points */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-zinc-500 text-xs">Points</p>
                        <p className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                          {participant.Matchpoints || 0}
                        </p>
                      </div>
                    </div>

                    {/* View Team Button */}
                    <button
                      onClick={() => router.push(`/dashboard/leaderboard/${tournamentId}/team/${participant.teamId}`)}
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm flex-shrink-0 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>View Team</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}