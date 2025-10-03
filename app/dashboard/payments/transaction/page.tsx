"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter, Download, Calendar } from 'lucide-react';

interface Transaction {
  _id: string | number;
  type: 'add' | 'withdraw' | 'tournament';
  title: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

export default function AllTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'add' | 'withdraw' | 'tournament'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/wallet/transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        setTransactions(data.transactions || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.amount.toString().includes(searchQuery);
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    totalAmount: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.type === 'add' ? t.amount : -t.amount), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">All Transactions</h1>
              <p className="text-gray-400">Complete history of your wallet activity</p>
            </div>
            
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-xl p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
          </div>
          <div className="bg-gray-900 border border-yellow-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-gray-900 border border-red-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="add">Add Funds</option>
              <option value="withdraw">Withdraw</option>
              <option value="tournament">Tournament</option>
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </h2>
            {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
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
                        {transaction.title}
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
                  <span className="text-3xl sm:text-4xl">🔍</span>
                </div>
                <p className="text-base sm:text-lg font-medium text-gray-300 mb-1">No transactions found</p>
                <p className="text-sm text-gray-500">
                  {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Your transaction history will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}