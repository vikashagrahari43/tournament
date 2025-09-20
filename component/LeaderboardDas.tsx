

function LeaderboardDas() {
  return (
   <div className="space-y-6">
              {/* Leaderboard Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">LEADERBOARD</h1>
                <p className="text-red-100">Top teams and players rankings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Rankings */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">TEAM RANKINGS</h3>
                  <div className="space-y-3">
                    {[
                      {rank: 1, name: 'Fire Dragons', points: 2850, badge: '🏆'},
                      {rank: 2, name: 'Shadow Wolves', points: 2756, badge: '🥈'},
                      {rank: 3, name: 'Thunder Hawks', points: 2691, badge: '🥉'},
                      {rank: 4, name: 'Ice Warriors', points: 2543, badge: '4️⃣'},
                      {rank: 5, name: 'Storm Eagles', points: 2398, badge: '5️⃣'},
                    ].map((team, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{team.badge}</span>
                          <div>
                            <p className="font-bold">{team.name}</p>
                            <p className="text-xs text-gray-400">Rank #{team.rank}</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-bold">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player Rankings */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">TOP PLAYERS</h3>
                  <div className="space-y-3">
                    {[
                      {rank: 1, name: 'DragonSlayer', team: 'Fire Dragons', kills: 245},
                      {rank: 2, name: 'ShadowHunter', team: 'Shadow Wolves', kills: 232},
                      {rank: 3, name: 'ThunderStrike', team: 'Thunder Hawks', kills: 218},
                      {rank: 4, name: 'IceBreaker', team: 'Ice Warriors', kills: 205},
                      {rank: 5, name: 'StormRider', team: 'Storm Eagles', kills: 198},
                    ].map((player, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <div>
                          <p className="font-bold text-sm">{player.name}</p>
                          <p className="text-xs text-gray-400">{player.team}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-red-500 font-bold">{player.kills}</span>
                          <p className="text-xs text-gray-400">kills</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  )
}

export default LeaderboardDas