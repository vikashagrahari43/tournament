"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight, AlertCircle, Loader2, Calendar, DollarSign, Users } from 'lucide-react';

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
}

export default function AdminTournamentsList() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/tournament');
      const data = await response.json();

      if (response.ok && data.success) {
        setTournaments(data.tournaments);
        setError('');
      } else {
        setError(data.error || 'Failed to load tournaments');
      }
    } catch (err: unknown) {
      setError('An error occurred while fetching tournaments: ' + (err as Error).message);
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
    router.push(`/admin/dashboard/manageTournament/${tournamentId}`);
  };

  const getStatusBadge = (status: Tournament['status']) => {
    const styles = {
      registering: 'bg-green-500/20 text-green-400 border-green-500/50',
      full: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    
    const labels = {
      registering: 'Open',
      full: 'Full',
      completed: 'Completed'
    };

    return (
      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-red-600/10 rounded-2xl border border-red-600/20 mb-3 sm:mb-4 md:mb-6 shadow-lg shadow-red-600/20">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text  px-4">
            Tournament <span className="text-red-600">Management</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg px-4 max-w-2xl mx-auto">
            Select a tournament to manage teams, matchpoints, and prize distribution
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-red-600/30 transition-colors">
              <p className="text-red-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total</p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{tournaments.length}</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-green-600/30 transition-colors">
              <p className="text-green-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Open</p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'registering').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-yellow-600/30 transition-colors">
              <p className="text-yellow-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Full</p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'full').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:border-gray-600/30 transition-colors">
              <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Completed</p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        )}

        {/* Tournament Cards */}
        {tournaments.length === 0 && !error ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-flex items-center justify-center p-6 sm:p-8 bg-zinc-900 rounded-3xl border border-zinc-800 mb-4 sm:mb-6">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-zinc-700" />
            </div>
            <p className="text-zinc-500 text-base sm:text-lg md:text-xl">No tournaments found</p>
            <p className="text-zinc-600 text-sm sm:text-base mt-2">Create your first tournament to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {tournaments.map((tournament) => (
              <button
                key={tournament._id}
                onClick={() => handleTournamentClick(tournament._id)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 text-left group cursor-pointer"
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
                  {/* Prize Pool Highlight */}
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

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/50 rounded-lg p-2.5 sm:p-3">
                      <p className="text-zinc-500 text-xs mb-1">Entry Fee</p>
                      <p className="text-white font-semibold text-sm sm:text-base">₹{tournament.entryFee}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-2.5 sm:p-3">
                      <p className="text-zinc-500 text-xs mb-1">Max Teams</p>
                      <p className="text-white font-semibold text-sm sm:text-base">{tournament.maxTeams}</p>
                    </div>
                  </div>

                  {/* Teams Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-500 mr-1.5" />
                        <span className="text-zinc-400 text-xs sm:text-sm">Teams Enrolled</span>
                      </div>
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {tournament.enrolledTeams || 0}/{tournament.maxTeams}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-red-600 to-red-800 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((tournament.enrolledTeams || 0) / tournament.maxTeams) * 100}%`
                        }}
                      />
                    </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}