
function StaticsDas() {
  return (
   <div className="space-y-6">
              {/* Match Statistics Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">MATCH STATISTICS</h1>
                <p className="text-red-100">Detailed performance analytics</p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">127</div>
                  <div className="text-gray-400">Total Kills</div>
                  <div className="text-xs text-green-400 mt-1">↑ +15 this week</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">85%</div>
                  <div className="text-gray-400">Accuracy</div>
                  <div className="text-xs text-green-400 mt-1">↑ +3% this week</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">24</div>
                  <div className="text-gray-400">Matches Played</div>
                  <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">18</div>
                  <div className="text-gray-400">Wins</div>
                  <div className="text-xs text-green-400 mt-1">75% Win Rate</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">WEAPON PERFORMANCE</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>AK-47</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-red-500 font-bold">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>M416</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-red-500 font-bold">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>AWM</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-red-500 font-bold">92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">MAP PERFORMANCE</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Erangel</span>
                      <span className="text-green-400 font-bold">8W - 2L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Miramar</span>
                      <span className="text-green-400 font-bold">6W - 3L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sanhok</span>
                      <span className="text-green-400 font-bold">4W - 1L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default StaticsDas