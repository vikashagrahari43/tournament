"use client"
import { useState } from 'react';
import { Calendar, Trophy, DollarSign, Users, Clock, Tag } from 'lucide-react';

export default function AddTournamentForm() {
  const [formData, setFormData] = useState({
    title: '',
    slogan: '',
    prizePool: '',
    entryFee: '',
    maxTeams: '',
    date: '',
    hour: '',
    minute: '',
    period: 'AM'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatTime12Hour = () => {
    const hour = formData.hour.padStart(2, '0');
    const minute = formData.minute.padStart(2, '0');
    return `${hour}:${minute} ${formData.period}`;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.slogan || !formData.prizePool || !formData.entryFee || 
        !formData.maxTeams || !formData.date || !formData.hour || !formData.minute) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    const hourNum = parseInt(formData.hour);
    const minuteNum = parseInt(formData.minute);

    if (hourNum < 1 || hourNum > 12) {
      setMessage({ type: 'error', text: 'Hour must be between 1 and 12' });
      return;
    }

    if (minuteNum < 0 || minuteNum > 59) {
      setMessage({ type: 'error', text: 'Minute must be between 0 and 59' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const time = formatTime12Hour();

      const response = await fetch('/api/admin/tournament/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slogan: formData.slogan,
          prizePool: Number(formData.prizePool),
          entryFee: Number(formData.entryFee),
          maxTeams: Number(formData.maxTeams),
          date: new Date(formData.date),
          time: time
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Tournament added successfully!' });
        setFormData({
          title: '',
          slogan: '',
          prizePool: '',
          entryFee: '',
          maxTeams: '',
          date: '',
          hour: '',
          minute: '',
          period: 'AM'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to add tournament' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/20 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Add New Tournament
            </h1>
            <p className="text-purple-300">Fill in the details to create a tournament</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Tournament Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Enter tournament title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Slogan
              </label>
              <input
                type="text"
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Enter tournament slogan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Prize Pool
                </label>
                <input
                  type="text"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Entry Fee
                </label>
                <input
                  type="text"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Maximum Teams
              </label>
              <input
                type="text"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleChange}
                min="2"
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Enter maximum teams"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Time (12-hour format)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  placeholder="HH"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center"
                />
                <input
                  type="number"
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  placeholder="MM"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center"
                />
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <p className="text-purple-300/60 text-xs mt-2">
                Example: 02:30 PM
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Tournament...
                </span>
              ) : (
                'Create Tournament'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}