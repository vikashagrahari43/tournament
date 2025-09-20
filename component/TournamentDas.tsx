"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, Clock, DollarSign, Eye, ChevronLeft, CreditCard, User, Mail, Phone, Shield } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  subtitle: string;
  status: string;
  prizePool: string;
  participants: string;
  maxParticipants: number;
  duration: string;
  format: string;
  startDate: string;
  endDate: string;
  image: string;
  color: string;
  registrationOpen: boolean;
  description: string;
  rules: string[];
  registrationFee: string;
  brackets?: {
    quarterFinals: string[];
    semiFinals: string[];
    finals: string;
    champion: string;
  } | null;
  champion?: string;
}

interface PaymentFormData {
  playerName: string;
  teamName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

const TournamentSystem: React.FC = () => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [registeredTournaments, setRegisteredTournaments] = useState<Set<number>>(new Set());
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'payment'>('list');
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    playerName: '',
    teamName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const tournaments: Tournament[] = [
    {
      id: 1,
      name: "Season 22 Championship",
      subtitle: "Battle for Glory",
      status: "LIVE",
      prizePool: "$50,000",
      participants: "128 Teams",
      maxParticipants: 128,
      duration: "3 Days",
      format: "Battle Royale",
      startDate: "2025-09-20",
      endDate: "2025-09-22",
      image: "🔥",
      color: "from-red-600 to-red-800",
      registrationOpen: true,
      registrationFee: "$150",
      description: "The ultimate championship where legends are born. Fight through intense battles in our most prestigious tournament.",
      rules: [
        "Maximum 4 players per team",
        "Best of 3 rounds elimination",
        "No third-party software allowed",
        "All matches streamed live",
        "Fair play policy enforced"
      ],
      brackets: {
        quarterFinals: [
          "Fire Dragons vs Ice Wolves",
          "Thunder Hawks vs Storm Eagles", 
          "Shadow Hunters vs Night Raiders",
          "Cyber Knights vs Tech Warriors"
        ],
        semiFinals: [
          "Fire Dragons vs Thunder Hawks",
          "Shadow Hunters vs Cyber Knights"
        ],
        finals: "Fire Dragons vs Shadow Hunters",
        champion: "TBD"
      }
    },
    {
      id: 2,
      name: "Winter Showdown",
      subtitle: "Frozen Arena Combat",
      status: "UPCOMING",
      prizePool: "$25,000",
      participants: "64 Teams",
      maxParticipants: 64,
      duration: "2 Days",
      format: "Elimination",
      startDate: "2025-10-15",
      endDate: "2025-10-16",
      image: "❄️",
      color: "from-blue-600 to-blue-800",
      registrationOpen: true,
      registrationFee: "$100",
      description: "Battle in the frozen wasteland where only the strongest survive the winter storms.",
      rules: [
        "Maximum 3 players per team",
        "Single elimination format",
        "Cold weather map only",
        "Stream delay allowed",
        "Professional referees"
      ],
      brackets: null
    },
    {
      id: 3,
      name: "Speed Demons Cup",
      subtitle: "Fast & Furious",
      status: "COMPLETED",
      prizePool: "$15,000",
      participants: "32 Teams",
      maxParticipants: 32,
      duration: "1 Day",
      format: "Time Attack",
      startDate: "2025-09-10",
      endDate: "2025-09-10",
      image: "⚡",
      color: "from-yellow-600 to-orange-800",
      registrationOpen: false,
      registrationFee: "$75",
      description: "Lightning-fast matches where speed and precision determine the winner.",
      rules: [
        "Solo players only",
        "3-minute rounds",
        "Speed boost enabled",
        "Instant respawn",
        "Leaderboard ranking"
      ],
      brackets: null,
      champion: "Lightning Strike"
    },
    {
      id: 4,
      name: "Cyber League",
      subtitle: "Digital Warfare",
      status: "UPCOMING",
      prizePool: "$35,000",
      participants: "96 Teams",
      maxParticipants: 96,
      duration: "4 Days",
      format: "Swiss System",
      startDate: "2025-11-01",
      endDate: "2025-11-04",
      image: "🤖",
      color: "from-purple-600 to-indigo-800",
      registrationOpen: true,
      registrationFee: "$125",
      description: "Enter the digital realm where technology meets skill in the ultimate cyber competition.",
      rules: [
        "Maximum 5 players per team",
        "Swiss tournament system",
        "Tech-enhanced weapons",
        "AI assistance banned",
        "Cybersecurity protocols"
      ],
      brackets: null
    },
    {
      id: 5,
      name: "Desert Storm",
      subtitle: "Sandstorm Survival",
      status: "REGISTERING",
      prizePool: "$20,000",
      participants: "48 Teams",
      maxParticipants: 48,
      duration: "2 Days",
      format: "Survival",
      startDate: "2025-10-28",
      endDate: "2025-10-29",
      image: "🏜️",
      color: "from-orange-600 to-red-700",
      registrationOpen: true,
      registrationFee: "$90",
      description: "Survive the harsh desert conditions while battling enemies in this ultimate endurance test.",
      rules: [
        "Teams of 2-4 players",
        "Limited resources",
        "Environmental hazards",
        "No external communication",
        "Survival time scoring"
      ],
      brackets: null
    },
    {
      id: 6,
      name: "Ocean Depths",
      subtitle: "Underwater Combat",
      status: "UPCOMING",
      prizePool: "$30,000",
      participants: "80 Teams",
      maxParticipants: 80,
      duration: "3 Days",
      format: "Territory Control",
      startDate: "2025-12-05",
      endDate: "2025-12-07",
      image: "🌊",
      color: "from-teal-600 to-blue-800",
      registrationOpen: true,
      registrationFee: "$110",
      description: "Dive deep into underwater battles where controlling territory is key to victory.",
      rules: [
        "Maximum 6 players per team",
        "Underwater physics",
        "Oxygen management",
        "Territory-based scoring",
        "Submarine vehicles allowed"
      ],
      brackets: null
    }
  ];

  // Navigation functions
  const updateURL = (view: string, tournamentId?: number) => {
    if (view === 'list') {
      window.history.pushState({ view: 'list' }, '', '#tournaments');
    } else if (view === 'detail' && tournamentId) {
      window.history.pushState({ view: 'detail', tournamentId }, '', `#tournament/${tournamentId}`);
    } else if (view === 'payment' && tournamentId) {
      window.history.pushState({ view: 'payment', tournamentId }, '', `#tournament/${tournamentId}/register`);
    }
  };

  const navigateToTournaments = () => {
    setCurrentView('list');
    setSelectedTournament(null);
    setShowPayment(false);
    updateURL('list');
  };

  const navigateToTournamentDetail = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setCurrentView('detail');
    setShowPayment(false);
    updateURL('detail', tournament.id);
  };

  const navigateToPayment = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setCurrentView('payment');
    setShowPayment(true);
    updateURL('payment', tournament.id);
  };

  const navigateBack = () => {
    if (currentView === 'payment') {
      navigateToTournamentDetail(selectedTournament!);
    } else if (currentView === 'detail') {
      navigateToTournaments();
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        if (state.view === 'list') {
          setCurrentView('list');
          setSelectedTournament(null);
          setShowPayment(false);
        } else if (state.view === 'detail' && state.tournamentId) {
          const tournament = tournaments.find(t => t.id === state.tournamentId);
          if (tournament) {
            setSelectedTournament(tournament);
            setCurrentView('detail');
            setShowPayment(false);
          }
        } else if (state.view === 'payment' && state.tournamentId) {
          const tournament = tournaments.find(t => t.id === state.tournamentId);
          if (tournament) {
            setSelectedTournament(tournament);
            setCurrentView('payment');
            setShowPayment(true);
          }
        }
      } else {
        // No state means we're at the root
        setCurrentView('list');
        setSelectedTournament(null);
        setShowPayment(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize the URL on first load
    const hash = window.location.hash;
    if (hash.startsWith('#tournament/')) {
      const parts = hash.split('/');
      const tournamentId = parseInt(parts[1]);
      const action = parts[2];
      const tournament = tournaments.find(t => t.id === tournamentId);
      
      if (tournament) {
        if (action === 'register') {
          setSelectedTournament(tournament);
          setCurrentView('payment');
          setShowPayment(true);
        } else {
          setSelectedTournament(tournament);
          setCurrentView('detail');
          setShowPayment(false);
        }
      }
    } else if (hash === '#tournaments' || hash === '') {
      setCurrentView('list');
      setSelectedTournament(null);
      setShowPayment(false);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'LIVE': return 'text-green-400 bg-green-900 bg-opacity-30';
      case 'UPCOMING': return 'text-blue-400 bg-blue-900 bg-opacity-30';
      case 'REGISTERING': return 'text-yellow-400 bg-yellow-900 bg-opacity-30';
      case 'COMPLETED': return 'text-gray-400 bg-gray-900 bg-opacity-30';
      default: return 'text-gray-400 bg-gray-900 bg-opacity-30';
    }
  };

  const handleRegister = (tournament: Tournament): void => {
    navigateToPayment(tournament);
  };

  const handlePaymentSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (selectedTournament) {
      setRegisteredTournaments(prev => new Set([...prev, selectedTournament.id]));
      setShowPayment(false);
      setSelectedTournament(null);
      setCurrentView('list');
      // Reset form
      setPaymentData({
        playerName: '',
        teamName: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
      });
      updateURL('list');
      alert('Registration successful! Welcome to the tournament!');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const TournamentCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-2xl w-full">
      <div className={`bg-gradient-to-r ${tournament.color} p-3 sm:p-4`}>
        <div className="flex items-center justify-between">
          <div className="text-2xl sm:text-3xl">{tournament.image}</div>
          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getStatusColor(tournament.status)}`}>
            {tournament.status}
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mt-2 text-white">{tournament.name}</h3>
        <p className="text-white opacity-80 text-sm sm:text-base">{tournament.subtitle}</p>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="flex items-center text-xs sm:text-sm">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-2" />
            <span className="text-gray-400">Prize:</span>
            <span className="ml-1 font-bold text-green-400">{tournament.prizePool}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-2" />
            <span className="text-gray-400">Teams:</span>
            <span className="ml-1 font-bold text-white">{tournament.participants}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mr-2" />
            <span className="text-gray-400">Duration:</span>
            <span className="ml-1 font-bold text-white">{tournament.duration}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
            <span className="text-gray-400">Format:</span>
            <span className="ml-1 font-bold text-white">{tournament.format}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-3 sm:mb-4 text-xs sm:text-sm">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 mr-2" />
          <span className="text-gray-400">Date:</span>
          <span className="ml-1 font-bold text-white text-xs sm:text-sm">{tournament.startDate} to {tournament.endDate}</span>
        </div>

        <div className="flex items-center mb-4 text-xs sm:text-sm">
          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mr-2" />
          <span className="text-gray-400">Fee:</span>
          <span className="ml-1 font-bold text-red-400">{tournament.registrationFee}</span>
        </div>

        <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-2">{tournament.description}</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => navigateToTournamentDetail(tournament)}
            className="flex-1 bg-gray-800 text-white py-2 px-3 sm:px-4 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            VIEW DETAILS
          </button>
          {tournament.registrationOpen && tournament.status !== 'COMPLETED' && (
            <button 
              onClick={() => handleRegister(tournament)}
              disabled={registeredTournaments.has(tournament.id)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-bold transition-colors text-sm ${
                registeredTournaments.has(tournament.id)
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {registeredTournaments.has(tournament.id) ? 'REGISTERED ✓' : 'REGISTER'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const PaymentSection: React.FC = () => (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={navigateBack}
          className="flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Tournament Details
        </button>

        <div className="bg-gray-900 rounded-xl p-4 sm:p-8 border border-gray-800">
          <div className="text-center mb-8">
            <div className="text-4xl sm:text-6xl mb-4">{selectedTournament?.image}</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Register for {selectedTournament?.name}</h1>
            <p className="text-gray-400">{selectedTournament?.subtitle}</p>
            <div className="mt-4 p-4 bg-red-900 bg-opacity-30 rounded-lg">
              <p className="text-red-400 font-bold text-lg sm:text-xl">Registration Fee: {selectedTournament?.registrationFee}</p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* Player Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-500 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Player Information
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Player Name *</label>
                  <input
                    type="text"
                    name="playerName"
                    value={paymentData.playerName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="Enter your player name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team Name *</label>
                  <input
                    type="text"
                    name="teamName"
                    value={paymentData.teamName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="Enter your team name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={paymentData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-500 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Card Holder Name *</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="Name on card"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg flex items-start">
              <Shield className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-green-400 font-bold">Secure Payment</h4>
                <p className="text-sm text-gray-300">Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Complete Registration - {selectedTournament?.registrationFee}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const TournamentDetail: React.FC<{ tournament: Tournament }> = ({ tournament }) => (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <button 
          onClick={navigateBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Tournaments
        </button>

        <div className={`bg-gradient-to-r ${tournament.color} rounded-xl p-4 sm:p-6 lg:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between">
            <div>
              <div className="text-3xl sm:text-4xl mb-2">{tournament.image}</div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-white">{tournament.name}</h1>
              <p className="text-white opacity-80">{tournament.subtitle}</p>
            </div>
            <div className={`px-3 sm:px-4 py-2 rounded-full font-bold ${getStatusColor(tournament.status)} mt-4 sm:mt-0 self-start`}>
              {tournament.status}
            </div>
          </div>
          <p className="text-white opacity-90 mt-4 text-sm sm:text-base">{tournament.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-4">TOURNAMENT INFO</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Status:</span>
                <span className={`font-bold ${tournament.status === 'LIVE' ? 'text-green-400' : tournament.status === 'UPCOMING' ? 'text-blue-400' : tournament.status === 'REGISTERING' ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {tournament.status}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Prize Pool:</span>
                <span className="text-green-400 font-bold">{tournament.prizePool}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Registration Fee:</span>
                <span className="text-red-400 font-bold">{tournament.registrationFee}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Participants:</span>
                <span className="font-bold text-white">{tournament.participants}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Max Teams:</span>
                <span className="font-bold text-white">{tournament.maxParticipants}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Duration:</span>
                <span className="font-bold text-white">{tournament.duration}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Format:</span>
                <span className="font-bold text-white">{tournament.format}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Start Date:</span>
                <span className="font-bold text-white">{tournament.startDate}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">End Date:</span>
                <span className="font-bold text-white">{tournament.endDate}</span>
              </div>
            </div>
            {tournament.registrationOpen && tournament.status !== 'COMPLETED' && (
              <button 
                onClick={() => handleRegister(tournament)}
                disabled={registeredTournaments.has(tournament.id)}
                className={`w-full mt-6 py-3 rounded-lg font-bold transition-colors text-sm sm:text-base ${
                  registeredTournaments.has(tournament.id)
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {registeredTournaments.has(tournament.id) ? 'REGISTERED ✓' : `REGISTER NOW - ${tournament.registrationFee}`}
              </button>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-4">TOURNAMENT RULES</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {tournament.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-white">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {tournament.brackets && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-4 sm:mb-6">TOURNAMENT BRACKETS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <h4 className="font-bold text-red-500 mb-3 text-sm sm:text-base">QUARTER FINALS</h4>
                <div className="space-y-2">
                  {tournament.brackets.quarterFinals.map((match, index) => (
                    <div key={index} className="bg-gray-800 p-2 sm:p-3 rounded text-xs sm:text-sm text-white">{match}</div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-red-500 mb-3 text-sm sm:text-base">SEMI FINALS</h4>
                <div className="space-y-2">
                  {tournament.brackets.semiFinals.map((match, index) => (
                    <div key={index} className="bg-gray-700 p-2 sm:p-3 rounded text-xs sm:text-sm text-white">{match}</div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-red-500 mb-3 text-sm sm:text-base">FINALS</h4>
                <div className="bg-red-900 p-2 sm:p-3 rounded text-xs sm:text-sm text-white">{tournament.brackets.finals}</div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-red-500 mb-3 text-sm sm:text-base">CHAMPION</h4>
                <div className="bg-yellow-900 p-2 sm:p-3 rounded text-xs sm:text-sm font-bold text-white">
                  🏆 {tournament.champion || tournament.brackets.champion}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Show payment section
  if (showPayment && selectedTournament) {
    return <PaymentSection />;
  }

  // Show tournament detail
  if (selectedTournament) {
    return <TournamentDetail tournament={selectedTournament} />;
  }

  // Main tournament list
  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
       

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tournaments.map(tournament => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentSystem;