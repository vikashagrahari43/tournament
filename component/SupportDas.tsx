
function SupportDas() {
  return (
   <div className="space-y-6">
              {/* Support Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">SUPPORT</h1>
                <p className="text-red-100">Get help and report issues</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Options */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">CONTACT US</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💬</span>
                        <div>
                          <p className="font-bold">Live Chat</p>
                          <p className="text-sm text-gray-400">Get instant help</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📧</span>
                        <div>
                          <p className="font-bold">Email Support</p>
                          <p className="text-sm text-gray-400">support@gaming.com</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🐛</span>
                        <div>
                          <p className="font-bold">Report Bug</p>
                          <p className="text-sm text-gray-400">Help us improve</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-red-500 mb-4">FREQUENTLY ASKED</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="font-bold text-sm">How to register for tournaments?</p>
                      <p className="text-xs text-gray-400 mt-1">Click on Tournament page and hit Register Now</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="font-bold text-sm">How to join a team?</p>
                      <p className="text-xs text-gray-400 mt-1">Go to My Team section and create or join existing teams</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="font-bold text-sm">Tournament schedule?</p>
                      <p className="text-xs text-gray-400 mt-1">Check Schedule page for all upcoming matches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default SupportDas