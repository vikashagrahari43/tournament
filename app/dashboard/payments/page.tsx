"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  _id: string | number;
  type: 'add' | 'withdraw' | 'tournament';
  description: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

interface Wallet {
  balance: number;
  transactions: Transaction[];
  upiId: string;
}

function PaymentDashboard() {
  const router = useRouter();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For delete button loading state

  useEffect(() => {
    // Fetch wallet data from API
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/wallet/mywallet', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch wallet data');
        }
        
        const data = await response.json();
        console.log('Fetched wallet data:', data);
        setWallet(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Failed to load wallet data');
        // Set fallback data in case of error
        setWallet({
          balance: 0,
          transactions: [],
          upiId: ''
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, []);

  // Navigation functions
  const navigateToAddFunds = () => {
    router.push('/dashboard/payments/addFunds');
  };

  const navigateToWithdraw = () => {
    router.push('/dashboard/payments/withdraw');
  };

  const navigateToAddBank = () => {
    router.push('/dashboard/payments/account');
  };

  const navigateToTransactions = () => {
    router.push('/dashboard/payments/transaction');
  };

  const navigateToAddUPI = () => {
    router.push('/dashboard/payments/UpiId');
  };

  const handleDelete = async () => {
  setIsLoading(true);
  try {
    const response = await fetch("/api/wallet/deleteUpi", {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete UPI ID");
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 100);
  } catch (error: any) {
    setError(error.message || "Failed to delete UPI ID. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading wallet data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-xl p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        {/* Account Balance */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-green-500 mb-2">WALLET BALANCE</h3>
            <div className="text-4xl font-bold text-white mb-2">
              ₹{wallet?.balance?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-400">Available Balance</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <button 
            onClick={navigateToAddFunds}
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition-colors border-2 border-transparent hover:border-green-400 cursor-pointer"
          >
            <div className="text-4xl mb-3">💳</div>
            <h3 className="text-xl font-bold mb-2">Add Funds</h3>
            <p className="text-green-100">Deposit money to your wallet</p>
          </button>
          <button 
            onClick={navigateToWithdraw}
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center transition-colors border-2 border-transparent hover:border-blue-400 cursor-pointer"
          >
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold mb-2">Withdraw Money</h3>
            <p className="text-blue-100">Transfer funds to your bank</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UPI Details */}
          <div className="bg-gray-900 rounded-xl md:p-6 p-2 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-500">UPI DETAILS</h3>
              
            </div>
            <div className="space-y-4">
              {wallet?.upiId ? (
                <div className="bg-gray-800 rounded-lg md:p-4 p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">UPI ID</p>
                      <p className="text-white md:text-[16px] text-[12px] font-semibold">{wallet.upiId}</p>
                    </div>
                    <div className="text-green-400">
                    <span className="">
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                            <span className="text-sm sm:text-base">Processing...</span>
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </span>
                  </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🏦</div>
                  <p className="text-gray-400 mb-3">No UPI ID added</p>
                  <button 
                    onClick={navigateToAddUPI}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Add UPI ID
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-500">RECENT TRANSACTIONS</h3>
              <button 
                onClick={navigateToTransactions}
                className="text-green-400 hover:text-green-300 text-sm transition-colors cursor-pointer"
              >
                View All →
              </button>
            </div>
                        <div className="space-y-3">
              {wallet?.transactions && wallet.transactions.length > 0 ? (
                wallet.transactions.slice().reverse().slice(0, 4).map((transaction) => (
                  <div 
                    key={transaction._id?.toString() || transaction.date} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 transition-colors gap-3 sm:gap-0"
                  >
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 ${
                        transaction.type === 'add' ? 'bg-green-600' : 
                        transaction.type === 'withdraw' ? 'bg-red-600' : 
                        'bg-purple-600'
                      } rounded-full flex items-center justify-center`}>
                        <span className="text-white text-base sm:text-lg font-bold">
                          {transaction.type === 'add' ? '↓' : 
                          transaction.type === 'withdraw' ? '↑' :
                          '🏆'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm sm:text-base truncate">
                          {transaction.description || "Transaction"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right Section */}
                    <div className="flex items-center justify-between sm:justify-end sm:text-right sm:ml-4">
                      <div>
                        <span className={`font-bold text-base sm:text-lg block ${
                          transaction.type === 'add' ? 'text-green-400' : 
                          transaction.type === 'withdraw' ? 'text-red-400' : 
                          'text-purple-400'
                        }`}>
                          {transaction.type === 'add' ? '+' : transaction.type === 'withdraw' ? '-' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-400' :
                            transaction.status === 'pending' ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}></span>
                          <p className={`text-xs font-medium capitalize ${
                            transaction.status === 'completed' ? 'text-green-400' :
                            transaction.status === 'pending' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 sm:py-16 text-gray-400">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl sm:text-4xl">📝</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium text-gray-300 mb-1">No transactions yet</p>
                  <p className="text-sm text-gray-500">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PaymentDashboard;