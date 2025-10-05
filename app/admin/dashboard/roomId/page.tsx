"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, DollarSign, Users, Edit, X, CheckCircle, AlertCircle, Loader2, Shield, Eye, EyeOff } from 'lucide-react';

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

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [roomPass, setRoomPass] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string>('');

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

  const handleEditClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setRoomId(tournament.RoomId || '');
    setRoomPass(tournament.RoomPass || '');
    setShowEditModal(true);
    setUpdateSuccess(false);
    setUpdateError('');
    setShowPassword(false);
  };

  const handleUpdateRoom = async () => {
    if (!selectedTournament) return;

    if (!roomId.trim() || !roomPass.trim()) {
      setUpdateError('Both Room ID and Password are required');
      return;
    }

    try {
      setUpdating(true);
      setUpdateError('');

      const response = await fetch(`/api/admin/tournament/room/${selectedTournament._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RoomId: roomId.trim(),
          RoomPass: roomPass.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUpdateSuccess(true);
        await fetchTournaments();
        
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setUpdateError(data.error || 'Failed to update room credentials');
      }
    } catch (err) {
      setUpdateError('An error occurred while updating');
    } finally {
      setUpdating(false);
    }
  };

  const closeModal = () => {
    if (!updating) {
      setShowEditModal(false);
      setSelectedTournament(null);
      setRoomId('');
      setRoomPass('');
      setUpdateSuccess(false);
      setUpdateError('');
      setShowPassword(false);
    }
  };

  const getStatusBadge = (status: Tournament['status']) => {
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
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-red-600/10 rounded-2xl border border-red-600/20 mb-4 sm:mb-6 shadow-lg shadow-red-600/20">
            <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text ">
            Admin <span className="text-red-600">Dashboard</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Manage all tournaments and update room credentials
          </p>
        </div>

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

        {/* Stats */}
        {tournaments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-red-600/30 transition-colors">
              <p className="text-red-400 text-xs sm:text-sm mb-2">Total</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">{tournaments.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-green-600/30 transition-colors">
              <p className="text-green-400 text-xs sm:text-sm mb-2">Registering</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'registering').length}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-yellow-600/30 transition-colors">
              <p className="text-yellow-400 text-xs sm:text-sm mb-2">Full</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'full').length}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-gray-600/30 transition-colors">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">Completed</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {tournaments.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        )}

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-base sm:text-lg">No tournaments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300"
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
                  {/* Prize Pool & Entry Fee */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-600/10 rounded-lg p-3 border border-red-600/20">
                      <div className="flex items-center mb-1">
                        <DollarSign className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-red-400 text-xs">Prize Pool</span>
                      </div>
                      <p className="text-white font-bold text-base sm:text-lg">
                        ₹{tournament.prizePool.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                      <div className="flex items-center mb-1">
                        <DollarSign className="w-4 h-4 text-zinc-500 mr-1" />
                        <span className="text-zinc-400 text-xs">Entry Fee</span>
                      </div>
                      <p className="text-white font-bold text-base sm:text-lg">₹{tournament.entryFee}</p>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-zinc-500 mr-2" />
                      <span className="text-zinc-500 text-xs sm:text-sm">Teams Enrolled</span>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center text-zinc-400 bg-zinc-800/50 rounded-lg p-2">
                      <Calendar className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-xs sm:text-sm">{formatDate(tournament.date)}</span>
                    </div>
                    <div className="flex items-center text-zinc-400 bg-zinc-800/50 rounded-lg p-2">
                      <Clock className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-xs sm:text-sm">{tournament.time}</span>
                    </div>
                  </div>

                  {/* Room Credentials */}
                  {tournament.RoomId && tournament.RoomPass ? (
                    <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                      <p className="text-green-400 text-xs font-semibold mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Room Credentials Set
                      </p>
                      <div className="space-y-1 text-xs">
                        <p className="text-zinc-400">ID: <span className="text-white font-mono">{tournament.RoomId}</span></p>
                        <p className="text-zinc-400">Pass: <span className="text-white font-mono">{tournament.RoomPass}</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3">
                      <p className="text-yellow-400 text-xs font-semibold flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Room Credentials Not Set
                      </p>
                    </div>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(tournament)}
                    className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg shadow-red-600/30 text-sm sm:text-base cursor-pointer"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Update Room Credentials
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedTournament && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl shadow-red-600/20 animate-in fade-in zoom-in duration-200 my-4">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2" />
                <span className="line-clamp-1">Update Room</span>
              </h3>
              {!updating && !updateSuccess && (
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
              {updateSuccess ? (
                <div className="text-center py-4 sm:py-6">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Successfully Updated!</h4>
                  <p className="text-zinc-400 text-sm sm:text-base">Room credentials have been updated.</p>
                </div>
              ) : (
                <>
                  <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-2">
                      {selectedTournament.title}
                    </h4>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      {formatDate(selectedTournament.date)} • {selectedTournament.time}
                    </p>
                  </div>

                  {/* Room ID Input */}
                  <div>
                    <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                      Room ID *
                    </label>
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter Room ID"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors text-sm sm:text-base"
                      disabled={updating}
                    />
                  </div>

                  {/* Room Password Input */}
                  <div>
                    <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                      Room Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={roomPass}
                        onChange={(e) => setRoomPass(e.target.value)}
                        placeholder="Enter Room Password"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors text-sm sm:text-base pr-12"
                        disabled={updating}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {updateError && (
                    <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm sm:text-base">Update Failed</p>
                        <p className="text-red-300 text-xs sm:text-sm">{updateError}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-blue-400 text-xs sm:text-sm">
                      <strong>Note:</strong> All enrolled teams will be able to see these credentials.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!updateSuccess && (
              <div className="p-4 sm:p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={closeModal}
                  disabled={updating}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRoom}
                  disabled={updating}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-900 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Credentials'
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