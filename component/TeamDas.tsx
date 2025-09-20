"use client"
import { useState } from "react"

function TeamDas({team} : {team: any}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [teamName, setTeamName] = useState<string>(team.name)
  const [originalName, setOriginalName] = useState<string>(team.name)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleEdit = () => {
    if (isEditing) {
      // Cancel edit - restore original name
      setTeamName(originalName)
      setIsEditing(false)
    } else {
      // Start editing
      setOriginalName(teamName) // Save current name as backup
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
        setOriginalName(data.team.name) // Update the backup
        setTeamName(data.team.name) // Ensure we use server response
        // Optional: Show success message
        // alert("Team name updated successfully!")
      } else {
        alert(data.error || "Failed to update team name")
        // Restore original name on error
        setTeamName(originalName)
      }
    } catch (error) {
      alert("Failed to update team name")
      // Restore original name on error
      setTeamName(originalName)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateName()
    } else if (e.key === 'Escape') {
      handleEdit() // Cancel edit
    }
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
        {/* Desktop Layout - Horizontal */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <input 
              type="text" 
              disabled={!isEditing || isLoading}
             
              className={` text-3xl lg:text-5xl font-bold bg-transparent text-white placeholder-red-200 ${
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

       
        <div className="sm:hidden space-y-4 mb-4">
          {/* Team Name Input */}
          <div className="w-full">
            <input 
              type="text" 
              disabled={!isEditing || isLoading}
              className={`w-full text-3xl font-bold bg-transparent text-white placeholder-red-200 ${
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
          
          {/* Action Buttons */}
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
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer "
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
        <p className="text-red-100 mt-2">Manage your team members</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-red-500 mb-6">TEAM MEMBERS</h3>
          <div className="space-y-4">
            {team.members.map((member: any, index: number) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mr-4">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-lg">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            + ADD NEW MEMBER
          </button>
        </div>

        {/* Team Stats */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-red-500 mb-4">TEAM STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Kills</span>
                <span className="font-bold text-red-500">619</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wins</span>
                <span className="font-bold text-red-500">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rank</span>
                <span className="font-bold text-red-500">#7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-bold text-red-500">68%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-red-500 mb-4">RECENT MATCHES</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>vs Thunder Hawks</span>
                <span className="text-green-500">Win</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>vs Fire Dragons</span>
                <span className="text-red-500">Loss</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>vs Shadow Wolves</span>
                <span className="text-green-500">Win</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamDas