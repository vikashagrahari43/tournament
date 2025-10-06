"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function AddUPIId() {
  const router = useRouter();
  const [upiIdinput, setUpiIdinput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // UPI ID validation regex
  const validateUpiId = (upi: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upi);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiIdinput.trim()) {
      setError('Please enter a UPI ID');
      return;
    }

    if (!validateUpiId(upiIdinput)) {
      setError('Please enter a valid UPI ID (e.g., username@paytm, 9876543210@ybl)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet/addUpi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upiId: upiIdinput.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add UPI ID');
      }

      setSuccess(true);
      setError(null);
      
      // Redirect back to payments dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/payments');
      }, 2000);

    } catch (error: any) {
      console.error('Error adding UPI ID:', error);
      setError(error.message || 'Failed to add UPI ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/payments');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpiIdinput(value);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">Success!</h2>
            <p className="text-gray-300 mb-4">Your UPI ID has been added successfully</p>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-green-400 font-semibold">{upiIdinput}</p>
            </div>
            <p className="text-sm text-gray-400">Redirecting to payments dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-8">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white mr-4 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Add UPI ID</h1>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          
          {/* Info Section */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🏦</div>
            <h2 className="text-xl font-bold text-green-500 mb-2">Link Your UPI ID</h2>
            <p className="text-gray-400 text-sm">
              Add your UPI ID to enable quick withdrawals and payments
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* UPI ID Input */}
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                id="upiId"
                value={upiIdinput}
                onChange={handleInputChange}
                placeholder="username@paytm or 9876543210@ybl"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI ID (e.g., yourname@paytm, mobilenumber@ybl)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !upiIdinput.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding UPI ID...
                </>
              ) : (
                'Add UPI ID'
              )}
            </button>
          </form> 

          {/* Popular UPI Apps */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-3">Popular UPI Apps:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="text-blue-400">@paytm</span>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="text-purple-400">@ybl</span>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="text-orange-400">@okaxis</span>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="text-green-400">@okhdfcbank</span>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="text-red-400">@okicici</span>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <span className="text-yellow-400">@oksbi</span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-400 mr-2 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Secure & Safe</p>
                <p className="text-blue-300 text-xs">
                  Your UPI ID is encrypted and stored securely. We never store your UPI PIN or banking credentials.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddUPIId;