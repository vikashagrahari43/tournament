"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, DollarSign, Users, ChevronRight, AlertCircle, Loader2, X, CheckCircle } from 'lucide-react';

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

type FilterType = 'all' | 'registering' | 'full' | 'completed';

export default function TournamentDashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [enrollSuccess, setEnrollSuccess] = useState<boolean>(false);
  const [enrollError, setEnrollError] = useState<string>('');

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
    } catch (err) {
      setError('An error occurred while fetching tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setShowModal(true);
    setEnrollSuccess(false);
    setEnrollError('');
  };

  const handleEnrollConfirm = async () => {
    if (!selectedTournament) return;

    try {
      setEnrolling(true);
      setEnrollError('');

      const response = await fetch(`/api/tournament/enroll/${selectedTournament._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEnrollSuccess(true);
        // Refresh tournaments list
        await fetchTournaments();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowModal(false);
          setSelectedTournament(null);
        }, 2000);
      } else {
        setEnrollError(data.error || 'Failed to enroll in tournament');
      }
    } catch (err) {
      setEnrollError('An error occurred while enrolling');
    } finally {
      setEnrolling(false);
    }
  };

  const closeModal = () => {
    if (!enrolling) {
      setShowModal(false);
      setSelectedTournament(null);
      setEnrollSuccess(false);
      setEnrollError('');
    }
  };

  const getStatusBadge = (status: Tournament['status']): any => {
    const styles: Record<Tournament['status'], string> = {
      registering: 'bg-green-500/20 text-green-400 border-green-500/50',
      full: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    
    const labels: Record<Tournament['status'], string> = {
      registering: 'Registering',
      full: 'Full',
      completed: 'Completed'
    };

    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
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

  const filteredTournaments = tournaments.filter((tournament) => {
    if (filter === 'all') return true;
    return tournament.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-lg">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-5 md:py-12 px-3 sm:px-4 lg:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
          {(['all', 'registering', 'full', 'completed'] as FilterType[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base cursor-pointer ${
                filter === status
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-zinc-900 text-red-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-base sm:text-lg">No tournaments found</p>
            <p className="text-zinc-600 text-sm mt-2">Check back later for new tournaments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-red-600/10 to-red-800/10 p-4 sm:p-6 border-b border-zinc-800">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex-1 pr-2 line-clamp-2">
                      {tournament.title}
                    </h3>
                    {getStatusBadge(tournament.status)}
                  </div>
                  <p className="text-red-400 text-xs sm:text-sm italic line-clamp-2">
                    {tournament.slogan}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Prize Pool */}
                  <div className="flex items-center justify-between p-3 bg-red-600/10 rounded-lg border border-red-600/20">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
                      <span className="text-red-400 text-xs sm:text-sm">Prize Pool</span>
                    </div>
                    <span className="text-white font-bold text-base sm:text-lg">
                      ₹{tournament.prizePool.toLocaleString()}
                    </span>
                  </div>

                  {/* Entry Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs sm:text-sm">Entry Fee</span>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      ₹{tournament.entryFee}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-zinc-500 mr-2" />
                      <span className="text-zinc-500 text-xs sm:text-sm">Teams</span>
                    </div>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {tournament.enrolledTeams || 0}/{tournament.maxTeams}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-800 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((tournament.enrolledTeams || 0) / tournament.maxTeams) * 100}%`
                      }}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center text-zinc-400">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500" />
                      <span className="text-xs sm:text-sm">{formatDate(tournament.date)}</span>
                    </div>
                    <div className="flex items-center text-zinc-400">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500" />
                      <span className="text-xs sm:text-sm">{tournament.time}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => tournament.status === 'registering' && handleJoinClick(tournament)}
                    className={`w-full mt-4 py-2.5 sm:py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 text-sm sm:text-base cursor-pointer ${
                      tournament.status === 'registering'
                        ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg shadow-red-600/30'
                        : tournament.status === 'full'
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    }`}
                    disabled={tournament.status !== 'registering'}
                  >
                    {tournament.status === 'registering' ? (
                      <>
                        Join Tournament
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </> 
                    ) : tournament.status === 'full' ? (
                      'Tournament Full'
                    ) : (
                      'Tournament Ended'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {tournaments.length > 0 && (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 text-center hover:border-red-600/30 transition-colors">
              <p className="text-red-400 text-xs sm:text-sm mb-2">Total Tournaments</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">{tournaments.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 text-center hover:border-red-600/30 transition-colors">
              <p className="text-green-400 text-xs sm:text-sm mb-2">Open for Registration</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'registering').length}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 text-center hover:border-red-600/30 transition-colors">
              <p className="text-yellow-400 text-xs sm:text-sm mb-2">Full Tournaments</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'full').length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl shadow-red-600/20 animate-in fade-in zoom-in duration-200 my-4">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2" />
                <span className="line-clamp-1">Confirm Enrollment</span>
              </h3>
              {!enrolling && !enrollSuccess && (
                <button
                  onClick={closeModal}
                  className="text-zinc-500 hover:text-white transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {enrollSuccess ? (
                <div className="text-center py-4 sm:py-6">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Successfully Enrolled!</h4>
                  <p className="text-zinc-400 text-sm sm:text-base">Your team has been registered for the tournament.</p>
                </div>
              ) : (
                <>
                  <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 line-clamp-2">{selectedTournament.title}</h4>
                    <p className="text-red-400 text-xs sm:text-sm italic line-clamp-2">{selectedTournament.slogan}</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-600/10 rounded-lg border border-red-600/20">
                      <span className="text-red-400 text-xs sm:text-sm">Entry Fee</span>
                      <span className="text-white font-bold text-base sm:text-lg">₹{selectedTournament.entryFee}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-zinc-800/50 rounded-lg">
                      <span className="text-zinc-400 text-xs sm:text-sm">Prize Pool</span>
                      <span className="text-white font-semibold text-sm sm:text-base">₹{selectedTournament.prizePool.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-zinc-800/50 rounded-lg">
                      <span className="text-zinc-400 text-xs sm:text-sm">Tournament Date</span>
                      <span className="text-white font-semibold text-sm sm:text-base">{formatDate(selectedTournament.date)}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-zinc-800/50 rounded-lg">
                      <span className="text-zinc-400 text-xs sm:text-sm">Time</span>
                      <span className="text-white font-semibold text-sm sm:text-base">{selectedTournament.time}</span>
                    </div>
                  </div>

                  {enrollError && (
                    <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm sm:text-base">Enrollment Failed</p>
                        <p className="text-red-300 text-xs sm:text-sm">{enrollError}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-yellow-400 text-xs sm:text-sm">
                      <strong>Note:</strong> The entry fee will be deducted from your wallet balance.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!enrollSuccess && (
              <div className="p-4 sm:p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={closeModal}
                  disabled={enrolling}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollConfirm}
                  disabled={enrolling}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-900 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm & Join'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}