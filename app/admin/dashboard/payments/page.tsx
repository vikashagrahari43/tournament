"use client"
import { useRouter } from 'next/navigation';

export default function AdminPaymentOptions() {
  const router = useRouter();

  const handleDeposit = () => {
    router.push('/admin/dashboard/payments/deposite');
  };

  const handleWithdraw = () => {
    router.push('/admin/dashboard/payments/withdraw');
  };

  return (
    <div className="min-h-screen bg-black flex  justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-black rounded-lg shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold  text-center mb-4 sm:mb-6 md:mb-8 text-white">
          Admin Payment Options
        </h2>
        
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <button
            onClick={handleDeposit}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md text-sm sm:text-base md:text-lg"
          >
            Deposit
          </button>
          
          <button
            onClick={handleWithdraw}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md text-sm sm:text-base md:text-lg"
          >
            Withdraw
          </button>
        </div>
        
        {/* Mobile-friendly spacing */}
        <div className="mt-6 sm:mt-8 md:mt-10 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Select a payment option to continue
          </p>
        </div>
      </div>
    </div>
  );
}