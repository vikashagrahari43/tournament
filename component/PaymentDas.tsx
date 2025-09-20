
function PaymentDas() {
  return (
    <div className="space-y-6">
              {/* Payments Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">PAYMENTS</h1>
                <p className="text-green-100">Manage your tournament fees and earnings</p>
              </div>

              {/* Account Balance */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-green-500 mb-2">WALLET BALANCE</h3>
                    <div className="text-3xl font-bold text-white mb-1">$1,250.00</div>
                    <div className="text-sm text-gray-400">Available Balance</div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-blue-500 mb-2">TOTAL EARNINGS</h3>
                    <div className="text-3xl font-bold text-white mb-1">$8,750.00</div>
                    <div className="text-sm text-gray-400">All Time</div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-orange-500 mb-2">PENDING PAYOUTS</h3>
                    <div className="text-3xl font-bold text-white mb-1">$450.00</div>
                    <div className="text-sm text-gray-400">Processing</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-green-500 mb-4">PAYMENT METHODS</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="font-bold">•••• •••• •••• 4532</p>
                          <p className="text-xs text-gray-400">Expires 12/26</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-orange-600 rounded flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">MC</span>
                        </div>
                        <div>
                          <p className="font-bold">•••• •••• •••• 8901</p>
                          <p className="text-xs text-gray-400">Expires 08/25</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                      + ADD NEW PAYMENT METHOD
                    </button>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-green-500 mb-4">RECENT TRANSACTIONS</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">+</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Tournament Win</p>
                          <p className="text-xs text-gray-400">Sept 14, 2024</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">+$450.00</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">-</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Entry Fee</p>
                          <p className="text-xs text-gray-400">Sept 12, 2024</p>
                        </div>
                      </div>
                      <span className="text-red-400 font-bold">-$50.00</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">+</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Prize Money</p>
                          <p className="text-xs text-gray-400">Sept 10, 2024</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">+$1200.00</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">$</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Wallet Deposit</p>
                          <p className="text-xs text-gray-400">Sept 8, 2024</p>
                        </div>
                      </div>
                      <span className="text-blue-400 font-bold">+$500.00</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600">
                    VIEW ALL TRANSACTIONS
                  </button>
                </div>
              </div>

              {/* Tournament Fees */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-green-500 mb-4">UPCOMING TOURNAMENT FEES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Season 22 Finals</h4>
                    <p className="text-sm text-gray-400 mb-3">Entry Fee Required</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-red-400">$100.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Due:</span>
                      <span className="text-yellow-400">2 days</span>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      PAY NOW
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Premium League</h4>
                    <p className="text-sm text-gray-400 mb-3">Monthly Subscription</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-red-400">$25.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Due:</span>
                      <span className="text-yellow-400">7 days</span>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      PAY NOW
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Team Registration</h4>
                    <p className="text-sm text-gray-400 mb-3">Annual Team Fee</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-green-400">PAID</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Valid Until:</span>
                      <span className="text-green-400">Dec 2024</span>
                    </div>
                    <button className="w-full bg-gray-600 text-gray-400 py-2 rounded cursor-not-allowed" disabled>
                      PAID
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-green-500 mb-4">QUICK ACTIONS</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">💳</div>
                    <p className="font-bold text-sm">Add Funds</p>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="font-bold text-sm">Withdraw</p>
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="font-bold text-sm">Statement</p>
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors">
                    <div className="text-2xl mb-2">🎫</div>
                    <p className="font-bold text-sm">Refunds</p>
                  </button>
                </div>
              </div>
            </div>
  )
}

export default PaymentDas