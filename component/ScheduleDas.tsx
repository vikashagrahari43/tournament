import React from 'react'

function ScheduleDas() {
  return (
    <div className="space-y-6">
              {/* Schedule Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">SCHEDULE</h1>
                <p className="text-red-100">Upcoming matches and events</p>
              </div>

              {/* Today's Matches */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-red-500 mb-4">TODAY'S MATCHES</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Quarter Final - Match 1</p>
                      <p className="text-sm text-gray-400">Fire Dragons vs Ice Wolves</p>
                      <p className="text-xs text-red-400">Erangel Classic</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">14:30</p>
                      <p className="text-xs text-gray-400">LIVE</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Quarter Final - Match 2</p>
                      <p className="text-sm text-gray-400">Thunder Hawks vs Storm Eagles</p>
                      <p className="text-xs text-red-400">Miramar Desert</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">16:00</p>
                      <p className="text-xs text-gray-400">Upcoming</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-red-500 mb-4">THIS WEEK</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">Tuesday</h4>
                    <p className="text-sm">Semi Finals</p>
                    <p className="text-xs text-gray-400">18:00 - 20:00</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">Thursday</h4>
                    <p className="text-sm">Finals</p>
                    <p className="text-xs text-gray-400">19:00 - 21:00</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">Sunday</h4>
                    <p className="text-sm">Grand Finals</p>
                    <p className="text-xs text-gray-400">20:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ScheduleDas