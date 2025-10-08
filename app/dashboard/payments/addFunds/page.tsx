"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export const AddFundsPage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi'); // Auto-select the only option

  // QR Code payment methods - only one option
  const qrPaymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      type: 'QR',
      icon: '📱',
      qrData: `upi://pay?pa=merchant@paytm&pn=MerchantName&am=${amount || '0'}&cu=INR&tn=Add Funds to Wallet`
    }
  ];

  const handleAddFunds = () => {
    const fundAmount = parseFloat(amount);
    if (!isNaN(fundAmount) && fundAmount > 0) {
      // Navigate to screenshot page instead of showing alert
      router.push(`/dashboard/payments/addFunds/screenshot?amount=${amount}`);
    } else {
      alert('Please enter a valid amount.');
    }
  };

  const handleBack = () => {
    router.push('/dashboard/payments');
  };

  // Generate QR code image
  const generateQRCode = (data: string) => {
    return (
      <div className="w-full max-w-48 h-48 bg-white p-4 rounded-lg mx-auto">
        <img 
          src="/qr.jpg" 
          alt="QR Code" 
          className="w-full h-full object-contain"
        />
      </div>
    );
  };

  const selectedQRMethod = qrPaymentMethods.find(method => method.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 sm:p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payments
          </button>
          
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-green-500 font-bold mb-2 text-sm sm:text-base">Enter Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl ">₹</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 sm:pl-8 pl-8 text-white text-lg sm:text-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-green-500 font-bold mb-2 text-sm sm:text-base">Quick Add</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[100, 250, 500, 1000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500 text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-green-500 font-bold mb-2 text-sm sm:text-base">Payment Method</label>
                <div className="space-y-3">
                  {/* QR Payment Method - Only One Option */}
                  {qrPaymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center bg-gray-800 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-700 border border-gray-700">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="mr-3 w-4 h-4"
                      />
                      <div className="w-10 h-8 sm:w-12 sm:h-8 bg-purple-600 rounded flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base sm:text-lg">{method.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm sm:text-base truncate">{method.name}</p>
                        <p className="text-xs text-gray-400">Scan QR to pay</p>
                      </div>
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex-shrink-0">QR</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* QR Code Display */}
              {selectedQRMethod && amount && (
                <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                  <h4 className="font-bold text-green-400 mb-4 text-center text-sm sm:text-base">
                    Scan QR Code to Pay ₹{amount}
                  </h4>
                  <div className="flex justify-center mb-4">
                    {generateQRCode(selectedQRMethod.qrData)}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xs sm:text-sm text-gray-300">
                      Open your {selectedQRMethod.name} app and scan this QR code
                    </p>
                    <p className="text-xs text-gray-500">
                      Amount: ₹{amount} | Method: {selectedQRMethod.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAddFunds}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors cursor-pointer" 
              >
                I Have Completed Payment
              </button>

              {/* Info Section */}
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <h4 className="font-bold text-green-400 mb-2 text-sm sm:text-base flex items-center">
                  <span className="mr-2">💡</span>
                  Payment Info
                </h4>
                <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                  <li>• Scan the QR code and complete payment</li>
                  <li>• Click I Have Completed Payment after paying</li>
                  <li>• Funds are verified and added within 6 working hours</li>
                  <li>• Minimum deposit: ₹10.00</li>
                  <li>• Maximum deposit: ₹50,000.00 per transaction</li>
                  <li>• All transactions are secure and encrypted Do not worry</li>
                  <li>• If any problem related to Payments you guys can directly contact us </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFundsPage;