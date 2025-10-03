"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

function TeamDas({team} : {team: any}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [teamName, setTeamName] = useState<string>(team.name)
  const [originalName, setOriginalName] = useState<string>(team.name)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [members, setMembers] = useState(team.members || [])
  const [copiedTeamId, setCopiedTeamId] = useState<boolean>(false)

  const handleEdit = () => {
    if (isEditing) {
      setTeamName(originalName)
      setIsEditing(false)
    } else {
      setOriginalName(teamName)
      setIsEditing(true)
    }
  }

  const updateName = async() => {
    if (!teamName.trim()) {
      alert("Team name cannot be empty")
      return
    }

    if (teamName === originalName) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/team/updateName", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: teamName.trim()})
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setIsEditing(false)
        setOriginalName(data.team.name) 
        setTeamName(data.team.name) 
      } else {
        alert(data.error || "Failed to update team name")
        setTeamName(originalName)
      }
    } catch (error) {
      alert("Failed to update team name")
      setTeamName(originalName)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateName()
    } else if (e.key === 'Escape') {
      handleEdit()
    }
  }

  const navigateToAddMember = () => {
    router.push('/dashboard/team/addmember')
  }

  const removeMember = async (memberId: string) => {
      const res = await fetch("/api/team/member/delete", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({memberId})
      })

      const data = await res.json()
      if (res.ok) {
        setMembers(data.team.members)
      } else {
        alert(data.error || "Failed to remove member")
      }
  }

  const copyTeamId = () => {
    if (team.teamid) {
      navigator.clipboard.writeText(team.teamid)
      setCopiedTeamId(true)
      setTimeout(() => setCopiedTeamId(false), 2000)
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-4 sm:p-6 lg:p-8">
        {/* Desktop Layout - Horizontal */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <input 
              type="text" 
              disabled={!isEditing || isLoading}
              className={`w-full text-2xl sm:text-3xl lg:text-5xl font-bold bg-transparent text-white placeholder-red-200 ${
                isEditing 
                  ? "border-b-2 border-white focus:outline-none focus:border-red-200 pb-1" 
                  : "border-none cursor-default"
              } ${isLoading ? "opacity-50" : ""}`}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter team name"
              maxLength={50}
            />
          </div>
          
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  className="bg-green-700 hover:bg-green-800 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  onClick={updateName}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="sm:hidden space-y-4 mb-4">
          <div className="w-full">
            <input 
              type="text" 
              disabled={!isEditing || isLoading}
              className={`w-full text-2xl sm:text-3xl font-bold bg-transparent text-white placeholder-red-200 ${
                isEditing 
                  ? "border-b-2 border-white focus:outline-none focus:border-red-200 pb-1" 
                  : "border-none cursor-default"
              } ${isLoading ? "opacity-50" : ""}`}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter team name"
              maxLength={50}
            />
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  onClick={updateName}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Team Info Section */}
        <div className="mt-4 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {/* Team ID */}
            <div className="flex items-center gap-2 bg-red-700/30 rounded-lg px-3 py-2">
              <span className="text-red-200 text-xs sm:text-sm font-medium">Team ID:</span>
              <code className="text-white font-mono text-xs sm:text-sm bg-red-900/40 px-2 py-1 rounded">
                {team.teamid || "N/A"}
              </code>
              <button
                onClick={copyTeamId}
                className="ml-1 text-white hover:text-red-200 transition-colors cursor-pointer text-xs sm:text-sm"
                title="Copy Team ID"
              >
                {copiedTeamId ? "✓" : "📋"}
              </button>
            </div>

            {/* Created By */}
            <div className="flex items-center gap-2 bg-red-700/30 rounded-lg px-3 py-2">
              <span className="text-red-200 text-xs sm:text-sm font-medium">Created by:</span>
              <span className="text-white font-semibold text-xs sm:text-sm">
                {team.createdby || "Unknown"}
              </span>
            </div>
          </div>
          <p className="text-red-100 text-sm sm:text-base">Manage your team members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Team Members */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
          <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-4 sm:mb-6">TEAM MEMBERS</h3>
          <div className="space-y-3 sm:space-y-4">
            {members.map((member: any, index: number) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 sm:p-4 flex flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center text-lg sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">
                    👤
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base sm:text-lg truncate">{member.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{member.role}</p>
                    {member.bgmiId && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">ID: {member.bgmiId}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end sm:justify-start">
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors cursor-pointer" onClick={() => removeMember(member._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            {members.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg mb-2">No team members yet</p>
                <p className="text-sm">Add your first team member to get started</p>
              </div>
            )}
          </div>
          <button 
            className="w-full mt-4 sm:mt-6 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm sm:text-base cursor-pointer"
            onClick={navigateToAddMember}
          >
            + ADD NEW MEMBER
          </button>
        </div>

        {/* Team Stats */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-base sm:text-lg font-bold text-red-500 mb-3 sm:mb-4">TEAM RULES</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Min K/D Ratio</span>
                <span className="font-bold text-red-500">1.5+</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Age Requirement</span>
                <span className="font-bold text-red-500">16+</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Practice Sessions</span>
                <span className="font-bold text-red-500">3/week</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Discord Activity</span>
                <span className="font-bold text-red-500">Required</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Trial Period</span>
                <span className="font-bold text-red-500">2 weeks</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-base sm:text-lg font-bold text-red-500 mb-3 sm:mb-4">REGULATIONS</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="truncate mr-2">No toxic behavior</span>
                <span className="text-red-500 flex-shrink-0">Strict</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="truncate mr-2">No cheating/exploiting</span>
                <span className="text-red-500 flex-shrink-0">Zero tolerance</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="truncate mr-2">Respectful communication</span>
                <span className="text-red-500 flex-shrink-0">Always</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamDas