"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Trophy, Users, Edit, X, CheckCircle, AlertCircle, Loader2, Crown, DollarSign, ArrowLeft, Send, Eye, Calendar, Clock } from 'lucide-react';

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
  prizeSent?: boolean;
}

export default function TournamentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [moneySent, setMoneySent] = useState<boolean>(tournament?.prizeSent || false);

  // Edit matchpoints modal states
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [newMatchpoints, setNewMatchpoints] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string>('');

  // Prize distribution states
  const [sendingPrize, setSendingPrize] = useState<boolean>(false);
  const [prizeSuccess, setPrizeSuccess] = useState<boolean>(false);
  const [prizeError, setPrizeError] = useState<string>('');

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentDetails();
    }
  }, [tournamentId]);

  const fetchTournamentDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tournament/${tournamentId}`);
      const data = await response.json();

      if (response.ok && data.tournament) {
        setTournament(data.tournament);
        setMoneySent(data.tournament.prizeSent || false);
        setError('');
      } else {
        setError(data.error || 'Failed to load tournament');
      }
    } catch (err) {
      setError('An error occurred while fetching tournament: ' + err);
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

  const handleEditMatchpoints = (participant: Participant) => {
    setEditingParticipant(participant);
    setNewMatchpoints(participant.Matchpoints?.toString() || '0');
    setShowEditModal(true);
    setUpdateSuccess(false);
    setUpdateError('');
  };

  const handleUpdateMatchpoints = async () => {
    if (!editingParticipant || !tournament) return;

    const points = parseInt(newMatchpoints);
    if (isNaN(points) || points < 0) {
      setUpdateError('Please enter a valid number');
      return;
    }

    try {
      setUpdating(true);
      setUpdateError('');

      const response = await fetch(`/api/admin/tournament/${tournament._id}/update-matchpoints`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: editingParticipant.teamId,
          matchpoints: points
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUpdateSuccess(true);
        await fetchTournamentDetails();
        
        setTimeout(() => {
          closeEditModal();
        }, 1500);
      } else {
        setUpdateError(data.error || 'Failed to update matchpoints');
      }
    } catch (err) {
      setUpdateError('An error occurred while updating: ' + err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendPrize = async (winner: Participant) => {
    if (!tournament) return;

    if (!confirm(`Send prize pool of ₹${tournament.prizePool.toLocaleString()} to ${winner.teamName}?`)) {
      return;
    }

    try {
      setSendingPrize(true);
      setPrizeError('');

      const response = await fetch(`/api/admin/tournament/${tournament._id}/send-prize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winnerEmail: winner.OwnerEmail,
          teamName: winner.teamName
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPrizeSuccess(true);
        setMoneySent(!moneySent);
        // setTimeout(() => setPrizeSuccess(false), 3000);
      } else {
        setPrizeError(data.error || 'Failed to send prize');
      }
    } catch (err) {
      setPrizeError('An error occurred while sending prize: ' + err);
    } finally {
      setSendingPrize(false);
    }
  };

  const handleTeamClick = (teamId: string) => {
    router.push(`/admin/dashboard/manageTournament/${tournamentId}/team/${teamId}`);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingParticipant(null);
    setNewMatchpoints('');
    setUpdateSuccess(false);
    setUpdateError('');
  };

  const getWinnerTeam = (): Participant | null => {
    if (!tournament?.participants || tournament.participants.length === 0) {
      return null;
    }
    
    return tournament.participants.reduce((prev, current) => 
      (current.Matchpoints || 0) > (prev.Matchpoints || 0) ? current : prev
    );
  };

  const getSortedParticipants = (): Participant[] => {
    if (!tournament?.participants) return [];
    return [...tournament.participants].sort((a, b) => 
      (b.Matchpoints || 0) - (a.Matchpoints || 0)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading tournament...</p>
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
          <p className="text-zinc-400 text-sm sm:text-base mb-6">{error || 'Unable to load tournament details'}</p>
          <button
            onClick={() => router.push('/admin/tournaments')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const winnerTeam = getWinnerTeam();
  const sortedParticipants = getSortedParticipants();

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 flex items-center text-zinc-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Tournaments</span>
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Prize Pool</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg md:text-xl">₹{tournament.prizePool.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Entry Fee</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg md:text-xl">₹{tournament.entryFee}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Teams</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg md:text-xl">
                {tournament.enrolledTeams || 0}/{tournament.maxTeams}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 mr-1.5" />
                <p className="text-zinc-400 text-xs sm:text-sm">Status</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg md:text-xl capitalize">{tournament.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="flex items-center text-zinc-400 bg-zinc-800/30 rounded-lg p-2.5 sm:p-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
              <span className="text-sm sm:text-base">{formatDate(tournament.date)}</span>
            </div>
            <div className="flex items-center text-zinc-400 bg-zinc-800/30 rounded-lg p-2.5 sm:p-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
              <span className="text-sm sm:text-base">{tournament.time}</span>
            </div>
          </div>
        </div>

        {/* Winner Section */}
        {winnerTeam && (
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border-2 border-yellow-600/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-yellow-400 text-xs sm:text-sm font-semibold mb-1">🏆 WINNER</p>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">{winnerTeam.teamName}</h2>
                  <p className="text-yellow-300 text-sm sm:text-base mt-1">Match Points: <span className="font-bold">{winnerTeam.Matchpoints || 0}</span></p>
                </div>
              </div>
              <button
                onClick={() => handleSendPrize(winnerTeam)}
                disabled={sendingPrize || prizeSuccess || moneySent}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base cursor-pointer" 
              >
                {sendingPrize ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Sending...
                  </>
                ) : prizeSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send Prize Pool
                  </>
                )}
              </button>
            </div>
            {prizeError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm">{prizeError}</p>
              </div>
            )}
          </div>
        )}

        {/* Teams List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
            Participating Teams ({sortedParticipants.length})
          </h2>

          {sortedParticipants.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-sm sm:text-base">No teams enrolled yet</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sortedParticipants.map((participant, index) => (
                <div
                  key={participant.teamId}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-red-600/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                      index === 0 ? 'bg-yellow-600 text-white' :
                      index === 1 ? 'bg-zinc-400 text-black' :
                      index === 2 ? 'bg-orange-700 text-white' :
                      'bg-zinc-700 text-zinc-400'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base sm:text-lg truncate">{participant.teamName}</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm truncate">{participant.OwnerEmail}</p>
                    </div>

                    {/* Match Points */}
                    <div className="text-left sm:text-right ml-auto sm:ml-0 sm:mr-3 md:mr-4">
                      <p className="text-zinc-500 text-xs">Match Points</p>
                      <p className="text-white font-bold text-lg sm:text-xl">{participant.Matchpoints || 0}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleTeamClick(participant.teamId)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>View</span>
                      </button>
                      
                      <button
                        onClick={() => handleEditMatchpoints(participant)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Matchpoints Modal */}
      {showEditModal && editingParticipant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl my-4">
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2" />
                <span className="line-clamp-1">Update Points</span>
              </h3>
              {!updating && !updateSuccess && (
                <button onClick={closeEditModal} className="text-zinc-500 hover:text-white flex-shrink-0 ml-2 cursor-pointer">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {updateSuccess ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Updated Successfully!</h4>
                  <p className="text-zinc-400 text-sm">Match points have been updated</p>
                </div>
              ) : (
                <>
                  <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700">
                    <h4 className="text-base sm:text-lg font-semibold text-white line-clamp-2">{editingParticipant.teamName}</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Current Points: <span className="font-semibold">{editingParticipant.Matchpoints || 0}</span></p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                      New Match Points *
                    </label>
                    <input
                      type="number"
                      value={newMatchpoints}
                      onChange={(e) => setNewMatchpoints(e.target.value)}
                      min="0"
                      placeholder="Enter match points"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors text-sm sm:text-base"
                      disabled={updating}
                    />
                  </div>

                  {updateError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-xs sm:text-sm">{updateError}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {!updateSuccess && (
              <div className="p-4 sm:p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={closeEditModal}
                  disabled={updating}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMatchpoints}
                  disabled={updating}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Points'
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