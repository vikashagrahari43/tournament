'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Trophy, User, Shield, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ITeamMember {
  name: string;
  bgmiId: number;
  role: string;
}

interface ITeam {
  _id: string;
  owner: string;
  name: string;
  members: ITeamMember[];
  teamid?: string;
  createdby?: string;
  createdAt?: string;
}

export default function AdminAllTeams() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.teamid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members.some(member => 
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.bgmiId.toString().includes(searchQuery)
        )
      );
      setFilteredTeams(filtered);
    }
  }, [searchQuery, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/team/all');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch teams');
      }

      setTeams(data.teams);
      setFilteredTeams(data.teams);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const getRoleBadgeColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('leader') || roleLower.includes('captain')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (roleLower.includes('support')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (roleLower.includes('assault') || roleLower.includes('entry')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (roleLower.includes('sniper')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Error Loading Teams</h3>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchTeams}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                All Teams
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage and view all registered teams</p>
            </div>
          </div>
        </div>

        {/* Stats and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team name, team ID, member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-gray-800/50 border border-gray-700/50 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total Teams</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{filteredTeams.length}</p>
            </div>
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 sm:p-12 text-center">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No Teams Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchQuery ? 'Try adjusting your search query' : 'No teams have been registered yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300"
              >
                {/* Team Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
                  onClick={() => toggleTeamExpansion(team._id)}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">{team.name}</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {team.teamid && (
                            <span className="text-xs px-2 sm:px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full whitespace-nowrap">
                              ID: {team.teamid}
                            </span>
                          )}
                          <span className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full whitespace-nowrap">
                            {team.members.length} Members
                          </span>
                          {team.createdby && (
                            <span className="text-xs px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full truncate max-w-[150px] sm:max-w-none">
                              By: {team.createdby}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0 cursor-pointer">
                      {expandedTeam === team._id ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Team Members (Expandable) */}
                {expandedTeam === team._id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-700/50">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 sm:mb-4 mt-3 sm:mt-4 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Team Members
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {team.members.map((member, index) => (
                        <div
                          key={index}
                          className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-3 sm:p-4 hover:border-red-600/30 transition-all"
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-white mb-1 truncate text-sm sm:text-base">{member.name}</h5>
                              <p className="text-xs sm:text-sm text-gray-400 mb-2">BGMI ID: {member.bgmiId}</p>
                              <span className={`inline-block text-xs px-2 py-1 rounded-md border ${getRoleBadgeColor(member.role)}`}>
                                {member.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}