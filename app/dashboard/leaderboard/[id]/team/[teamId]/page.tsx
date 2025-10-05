"use client";
import React, {JSX} from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Users, ArrowLeft, AlertCircle, Loader2, UserCircle, Shield, Mail, Trophy, Hash, Calendar, Target, Award } from 'lucide-react';

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
  createdAt?: string;
}

export default function UserTeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id as string;
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/team/${teamId}`);
      const data = await response.json();

      if (response.ok && data.team) {
        setTeam(data.team);
        setError('');
      } else {
        setError(data.error || 'Failed to load team details');
      }
    } catch (err) {
      setError('An error occurred while fetching team details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getRoleColor = (role: string): string => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('leader') || roleLower.includes('captain')) {
      return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50';
    } else if (roleLower.includes('assault') || roleLower.includes('attacker')) {
      return 'bg-red-600/20 text-red-400 border-red-600/50';
    } else if (roleLower.includes('support')) {
      return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
    } else if (roleLower.includes('sniper')) {
      return 'bg-purple-600/20 text-purple-400 border-purple-600/50';
    } else {
      return 'bg-green-600/20 text-green-400 border-green-600/50';
    }
  };

  const getRoleIcon = (role: string): JSX.Element => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('leader') || roleLower.includes('captain')) {
      return <Shield className="w-4 h-4 sm:w-5 sm:h-5" />;
    } else if (roleLower.includes('assault') || roleLower.includes('attacker')) {
      return <Target className="w-4 h-4 sm:w-5 sm:h-5" />;
    } else {
      return <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Team Not Found</h2>
          <p className="text-zinc-400 text-sm sm:text-base mb-6">{error || 'Unable to load team details'}</p>
          <button
            onClick={() => router.push(`/dashboard/leaderboard/${tournamentId}`)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            Back to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 flex items-center text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Leaderboard</span>
        </button>

        {/* Team Header Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            {/* Team Icon */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-1" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">
                  {team.name}
                </h1>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center text-zinc-400">
                  <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  <span className="font-mono">{team.teamid || 'N/A'}</span>
                </div>
                <span className="text-zinc-600">•</span>
                <div className="flex items-center text-zinc-400">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  <span>{team.members.length} Members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/10 rounded-lg">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-zinc-500 text-xs">Created By</p>
                <p className="text-white text-sm sm:text-base font-semibold truncate">{team.createdby || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-red-500" />
              Team Members
            </h2>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600/20 text-red-400 rounded-full text-xs sm:text-sm font-bold border border-red-600/30">
              {team.members.length}/6
            </span>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {team.members.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-red-600/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Member Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-red-600/50 transition-shadow">
                    <UserCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white break-words group-hover:text-red-400 transition-colors">
                        {member.name}
                      </h3>
                      <span className={`flex-shrink-0 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        <span className="hidden sm:inline">{member.role}</span>
                        <span className="sm:hidden">{member.role.substring(0, 3)}</span>
                      </span>
                    </div>

                    {/* BGMI ID */}
                    <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                      <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-xs">BGMI ID</p>
                        <p className="text-white text-sm sm:text-base font-mono font-semibold truncate">
                          {member.bgmiId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Number Badge */}
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs sm:text-sm">Player #{index + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      index === 0 ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50' :
                      'bg-zinc-700/50 text-zinc-400'
                    }`}>
                      {index === 0 ? 'Leader' : 'Member'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Stats Footer */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-zinc-800/30 rounded-lg p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">{team.members.length}</p>
                <p className="text-zinc-500 text-xs sm:text-sm">Members</p>
              </div>
              
              <div className="bg-zinc-800/30 rounded-lg p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                </div>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                  {team.members.filter(m => m.role.toLowerCase().includes('leader') || m.role.toLowerCase().includes('captain')).length}
                </p>
                <p className="text-zinc-500 text-xs sm:text-sm">Leaders</p>
              </div>
              
              <div className="bg-zinc-800/30 rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                  {new Set(team.members.map(m => m.role)).size}
                </p>
                <p className="text-zinc-500 text-xs sm:text-sm">Roles</p>
              </div>
            </div>
          </div>

          {/* Team Status */}
          <div className={`mt-6 p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${
            team.members.length >= 4 && team.members.length <= 6
              ? 'bg-green-600/10 border-green-600/30'
              : 'bg-yellow-600/10 border-yellow-600/30'
          }`}>
            {team.members.length >= 4 && team.members.length <= 6 ? (
              <>
                <div className="flex-shrink-0 p-2 bg-green-600/20 rounded-lg">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-sm sm:text-base">Tournament Ready!</p>
                  <p className="text-green-300/80 text-xs sm:text-sm mt-1">
                    This team is eligible to participate in tournaments.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex-shrink-0 p-2 bg-yellow-600/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-yellow-400 font-semibold text-sm sm:text-base">Team Incomplete</p>
                  <p className="text-yellow-300/80 text-xs sm:text-sm mt-1">
                    Teams need 4-6 members to participate in tournaments.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}