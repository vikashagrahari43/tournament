"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Key, Eye, EyeOff, Trash2, LogOut, UserCircle, Hash, ChevronRight, AlertCircle, CheckCircle, Loader2, X, Lock } from 'lucide-react';

interface UserProfile {
  username: string;
  email: string;
  teamId?: string | null;
}

export default function UserProfilePage() {
  const router = useRouter();
  
  // User data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  // Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/me');
      const data = await response.json();

      if (response.ok && data.user) {
        setProfile(data.user);
        setError('');
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError('');

      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordSuccess(true);
        setTimeout(() => {
          closePasswordModal();
        }, 2000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('An error occurred while changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete') {
      setDeleteError('Please type DELETE to confirm');
      return;
    }

    try {
      setDeleting(true);
      setDeleteError('');

      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to login or home page after deletion
        router.push('/');
      } else {
        setDeleteError(data.error || 'Failed to delete account');
      }
    } catch (err) {
      setDeleteError('An error occurred while deleting account');
    } finally {
      setDeleting(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordSuccess(false);
    setPasswordError('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
    setDeleteError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-red-400 text-base sm:text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Unable to Load Profile</h2>
          <p className="text-zinc-400 text-sm sm:text-base mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        

        {/* Profile Information Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
            Account Information
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Username */}
            <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-5 border border-zinc-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-600/10 rounded-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-500 text-xs sm:text-sm">Username</p>
                  <p className="text-white text-base sm:text-lg font-semibold truncate">{profile.username}</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-5 border border-zinc-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-600/10 rounded-lg">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-500 text-xs sm:text-sm">Email Address</p>
                  <p className="text-white text-base sm:text-lg font-semibold truncate">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Team ID */}
            <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-5 border border-zinc-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-600/10 rounded-lg">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-500 text-xs sm:text-sm">Team ID</p>
                  {profile.teamId ? (
                    <p className="text-white text-base sm:text-lg font-semibold font-mono truncate">{profile.teamId}</p>
                  ) : (
                    <p className="text-zinc-500 text-base sm:text-lg italic">Not in a team</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
            Security & Settings
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Change Password */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-red-600/50 rounded-lg p-4 sm:p-5 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Key className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">Change Password</p>
                    <p className="text-zinc-500 text-xs sm:text-sm">Update your account password</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            {/* Admin Profile */}
            <button
              onClick={() => router.push('/dashboard/support')}
              className="w-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-red-600/50 rounded-lg p-4 sm:p-5 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-600/10 rounded-lg group-hover:bg-purple-600/20 transition-colors">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">Support</p>
                    <p className="text-zinc-500 text-xs sm:text-sm">Get help and support</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4 sm:mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Danger Zone
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Delete Account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-950/30 hover:bg-red-950/50 border border-red-900/50 hover:border-red-600 rounded-lg p-4 sm:p-5 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm sm:text-base">Delete Account</p>
                    <p className="text-red-300/60 text-xs sm:text-sm">Permanently delete your account and all data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl my-4">
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Key className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2" />
                Change Password
              </h3>
              {!changingPassword && !passwordSuccess && (
                <button onClick={closePasswordModal} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {passwordSuccess ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Password Changed!</h4>
                  <p className="text-zinc-400 text-sm">Your password has been updated successfully</p>
                </div>
              ) : (
                <>
                  {/* Current Password */}
                  <div>
                    <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors text-sm sm:text-base pr-12"
                        disabled={changingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors text-sm sm:text-base pr-12"
                        disabled={changingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">At least 6 characters</p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors text-sm sm:text-base pr-12"
                        disabled={changingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-xs sm:text-sm">{passwordError}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {!passwordSuccess && (
              <div className="p-4 sm:p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-red-900/50 rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl shadow-red-600/20 my-4">
            <div className="p-4 sm:p-6 border-b border-red-900/50 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-red-400 flex items-center">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Delete Account
              </h3>
              {!deleting && (
                <button onClick={closeDeleteModal} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />
                </button>
              )}
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold text-sm sm:text-base mb-1">Warning: This action cannot be undone!</p>
                    <p className="text-red-300/80 text-xs sm:text-sm">
                      Deleting your account will permanently remove all your data, including:
                    </p>
                    <ul className="list-disc list-inside text-red-300/80 text-xs sm:text-sm mt-2 space-y-1">
                      <li>Profile information</li>
                      <li>Team memberships</li>
                      <li>Tournament history</li>
                      <li>Wallet balance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs sm:text-sm font-medium mb-2">
                  Type <span className="text-red-400 font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-red-900/50 rounded-lg text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors text-sm sm:text-base"
                  disabled={deleting}
                />
              </div>

              {deleteError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs sm:text-sm">{deleteError}</p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-red-900/50 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="w-full sm:flex-1 py-2.5 sm:py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="w-full sm:flex-1 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}