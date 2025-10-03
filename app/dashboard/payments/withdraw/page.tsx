"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, AlertCircle, CheckCircle, DollarSign, CreditCard } from 'lucide-react';

interface WalletData {
  balance: number;  
  upiId: string;
}

export default function WithdrawMoneyPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const quickAmounts = [500, 1000, 2000, 5000];

  useEffect(() => {
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
        setWallet(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Failed to load wallet data');
        setWallet({ balance: 0, upiId: '' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, []);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError(null);
  };

  const validateWithdrawal = () => {
    const withdrawAmount = parseFloat(amount);

    if (!amount || isNaN(withdrawAmount)) {
      setError('Please enter a valid amount');
      return false;
    }

    if (withdrawAmount <= 0) {
      setError('Amount must be greater than zero');
      return false;
    }

    if (withdrawAmount > (wallet?.balance || 0)) {
      setError('Insufficient balance');
      return false;
    }

    if (withdrawAmount < 100) {
      setError('Minimum withdrawal amount is ₹100');
      return false;
    }

    if (!wallet?.upiId) {
      setError('Please add UPI ID first');
      return false;
    }

    return true;
  };

  const handleWithdraw = async () => {
    setError(null);
    setSuccess(null);

    if (!validateWithdrawal()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          upiId: wallet?.upiId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process withdrawal');
      }

      setSuccess('Withdrawal request submitted successfully! Processing may take 24-48 hours.');
      setAmount('');
      
      if (wallet) {
        setWallet({
          ...wallet,
          balance: wallet.balance - parseFloat(amount)
        });
      }

      setTimeout(() => {
        router.push('/dashboard/payments');
      }, 2000);

    } catch (error: any) {
      console.error('Withdrawal error:', error);
      setError(error.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Withdraw Money</h1>
              <p className="text-gray-400 text-sm sm:text-base">Transfer funds to your UPI account</p>
            </div>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-6 border border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Available Balance</p>
              <p className="text-3xl sm:text-4xl font-bold text-white">
                ₹{wallet?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <Wallet className="w-12 h-12 text-blue-200 opacity-50" />
          </div>
        </div>

        {/* UPI Info Card */}
        {wallet?.upiId ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Withdraw to UPI ID</p>
                <p className="text-white font-semibold">{wallet.upiId}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-200 font-medium">No UPI ID Added</p>
                <p className="text-yellow-300 text-sm">Please add your UPI ID to withdraw funds</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/payments/UpiId')}
              className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Add UPI ID
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900 border border-green-700 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-200">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Withdrawal Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              Enter Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-4 text-white text-xl font-semibold placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                step="0.01"
                min="0"
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Minimum withdrawal: ₹100
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Quick Select</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleQuickAmount(value)}
                  disabled={value > (wallet?.balance || 0)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                    value > (wallet?.balance || 0)
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border-2 border-transparent hover:border-blue-500'
                  }`}
                >
                  ₹{value}
                </button>
              ))}
            </div>
          </div>

          {/* Withdraw All Button */}
          {wallet && wallet.balance >= 100 && (
            <button
              type="button"
              onClick={() => handleQuickAmount(wallet.balance)}
              className="w-full mb-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors border-2 border-transparent hover:border-blue-500"
            >
              Withdraw Full Balance (₹{wallet.balance.toFixed(2)})
            </button>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={submitting || !wallet?.upiId}
            className={`w-full font-bold py-4 px-6 rounded-xl transition-colors text-lg ${
              submitting || !wallet?.upiId
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : (
              'Withdraw Money'
            )}
          </button>

          {/* Important Notice */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300 text-sm font-medium mb-2">⚠️ Important Information</p>
            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
              <li>Withdrawals are processed within 24-48 hours</li>
              <li>Money will be transferred to your registered UPI ID</li>
              <li>Minimum withdrawal amount is ₹100</li>
              <li>No charges for withdrawals</li>
              <li>Contact support if you face any issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}