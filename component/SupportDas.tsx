"use client";
import React from 'react';

function SupportDas() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Support Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">SUPPORT</h1>
            <p className="text-sm sm:text-base text-red-100">Get help and report issues</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Contact Options */}
            <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-3 sm:mb-4">CONTACT US</h3>
              <div className="space-y-3 sm:space-y-4">
                <a 
                  href="https://chat.whatsapp.com/Dy33jkBHFGjCG4XEOc4pET?mode=ems_copy_t" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">💬</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">WhatsApp Group</p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">Join our community</p>
                    </div>
                  </div>
                </a>
                <a 
                  href="https://www.youtube.com/@tandavesports-m3b?si=x2cxpWZ-yW_u3dCl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">▶️</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">Youtube Link </p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">Must Subscribe to watch live</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://www.instagram.com/tandav_esports__/?igsh=YTBxdDJqemo1ZG45#"
                   target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">🅾</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">Instagram Link</p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">tandav_esports__</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://discord.com/invite/gfrnKWXj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">💬</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">Discord Server</p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">Chat with players</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  className="block w-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors p-3 sm:p-4 rounded-lg"
                  href="https://www.vikashagrahari.me" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center">
                    <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">🐛</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">Report Bug With Developer</p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">Help us to Improve</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-3 sm:mb-4">FREQUENTLY ASKED</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-bold text-xs sm:text-sm">Time takes to Add Funds? </p>
                  <p className="text-xs text-gray-400 mt-1">Within 24 hr the money will be credited</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-bold text-xs sm:text-sm">What if I failed to Upload Screenshot after Payment? </p>
                  <p className="text-xs text-gray-400 mt-1">Do'nt worry Just ReUpload with the same amount of payment </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-bold text-xs sm:text-sm">What if I did't got my Winner Amount?</p>
                  <p className="text-xs text-gray-400 mt-1">This is Rare But If it is please Contact to the admin</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-bold text-xs sm:text-sm">How to join a team?</p>
                  <p className="text-xs text-gray-400 mt-1">Go to My Team section and create or join existing teams</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-bold text-xs sm:text-sm">Time to get Withdraw?</p>
                  <p className="text-xs text-gray-400 mt-1">The Money will guarantee deposit within 24 hr</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-bold text-xs sm:text-sm">How to contact support?</p>
                  <p className="text-xs text-gray-400 mt-1">Use WhatsApp, Instagram, or Discord from the contact options</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Help Section */}
          <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-3 sm:mb-4">QUICK LINK</h3>

              <a href="/rulebook.pdf" target='_blank' rel="noopener noreferrer">
              <div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <span className="text-2xl sm:text-3xl mb-2 block">📖</span>
                <p className="font-bold text-xs sm:text-sm">Documentation</p>
                <p className="text-xs text-gray-400 mt-1">Read our guides</p>
              </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default SupportDas;