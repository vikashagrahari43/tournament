'use client';

import { useState, useEffect } from 'react';
import { Wallet, Search, DollarSign, TrendingUp, TrendingDown, Loader2, AlertCircle, ChevronDown, ChevronUp, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ITransaction {
  type: "add" | "withdraw" | "tournament";
  amount: number;
  status: "pending" | "completed" | "failed";
  description?: string;
  screenshotUrl?: string;
  date: string;
  userEmail?: string;
}

interface IWallet {
  _id: string;
  email: string;
  userId: string;
  balance: number;
  upiId?: string;
  transactions: ITransaction[];
}

export default function AdminAllWallets() {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<IWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  useEffect(() => {
    fetchWallets();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWallets(wallets);
    } else {
      const filtered = wallets.filter(wallet => 
        wallet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.upiId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.balance.toString().includes(searchQuery)
      );
      setFilteredWallets(filtered);
    }
  }, [searchQuery, wallets]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/wallet/getall');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wallets');
      }

      setWallets(data.wallets);
      setFilteredWallets(data.wallets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWalletExpansion = (walletId: string) => {
    setExpandedWallet(expandedWallet === walletId ? null : walletId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'add':
        return 'text-green-400';
      case 'withdraw':
        return 'text-red-400';
      case 'tournament':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <TrendingUp className="w-4 h-4" />;
      case 'withdraw':
        return <TrendingDown className="w-4 h-4" />;
      case 'tournament':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTotalBalance = () => {
    return filteredWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  };

  const getTotalTransactions = () => {
    return filteredWallets.reduce((sum, wallet) => sum + wallet.transactions.length, 0);
  };

  const getPendingCount = () => {
    return filteredWallets.reduce((sum, wallet) => 
      sum + wallet.transactions.filter(t => t.status === 'pending').length, 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">Loading wallets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Error Loading Wallets</h3>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchWallets}
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
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                All Wallets
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage and view all user wallets</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Wallets</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{filteredWallets.length}</p>
              </div>
              <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">₹{getTotalBalance()}</p>
              </div>
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-gray-400 text-xs mb-1">Transactions</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{getTotalTransactions()}</p>
              </div>
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-gray-400 text-xs mb-1">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{getPendingCount()}</p>
              </div>
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, UPI ID, or balance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-gray-800/50 border border-gray-700/50 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
            />
          </div>
        </div>

        {/* Wallets List */}
        {filteredWallets.length === 0 ? (
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 sm:p-12 text-center">
            <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No Wallets Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchQuery ? 'Try adjusting your search query' : 'No wallets have been created yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWallets.map((wallet) => (
              <div
                key={wallet._id}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300"
              >
                {/* Wallet Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
                  onClick={() => toggleWalletExpansion(wallet._id)}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">{wallet.email}</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="text-xs px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-semibold whitespace-nowrap">
                            Balance: ₹{wallet.balance}
                          </span>
                          {wallet.upiId && (
                            <span className="text-xs px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full truncate max-w-[150px] sm:max-w-none">
                              UPI: {wallet.upiId}
                            </span>
                          )}
                          <span className="text-xs px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full whitespace-nowrap">
                            {wallet.transactions.length} Transactions
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0 cursor-pointer">
                      {expandedWallet === wallet._id ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Transactions (Expandable) */}
                {expandedWallet === wallet._id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-700/50">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 sm:mb-4 mt-3 sm:mt-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Transaction History
                    </h4>
                    {wallet.transactions.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-gray-500">
                        <p className="text-sm sm:text-base">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {wallet.transactions.map((transaction, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-3 sm:p-4 hover:border-red-600/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(transaction.type)}`}>
                                  {getTypeIcon(transaction.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h5 className="font-semibold text-white capitalize text-sm sm:text-base">{transaction.type}</h5>
                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${getStatusColor(transaction.status)}`}>
                                      {getStatusIcon(transaction.status)}
                                      {transaction.status}
                                    </span>
                                  </div>
                                  <p className={`text-base sm:text-lg font-bold mb-1 ${transaction.type === 'add' ? 'text-green-400' : 'text-red-400'}`}>
                                    {transaction.type === 'add' ? '+' : '-'}₹{transaction.amount}
                                  </p>
                                  {transaction.description && (
                                    <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">{transaction.description}</p>
                                  )}
                                  <p className="text-xs text-gray-500">
                                    {new Date(transaction.date).toLocaleString()}
                                  </p>
                                  {transaction.screenshotUrl && (
                                    <a 
                                      href={transaction.screenshotUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                                    >
                                      View Screenshot →
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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