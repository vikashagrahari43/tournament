"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Gamepad2, Shield, Star, Zap, AlertCircle, X, LogIn } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (!email.trim()) {
      setError("Email address is required");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("admin-login", {
        username: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle different types of auth errors
        switch (result.error) {
          case "CredentialsSignin":
            setError("Invalid email or password. Please try again.");
            break;
          case "Configuration":
            setError("Authentication configuration error. Please contact support.");
            break;
          default:
            setError(result.error || "Login failed. Please try again.");
        }
      } else {
        setSuccess("Login successful! Entering in Tadav Gaming...");
        
        // Delay redirect to show success message
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setError("");
  };

  const dismissSuccess = () => {
    setSuccess("");
  };

  const handleRegisterRedirect = () => {
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated grid background */}
     
      
     

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {/* Header - responsive spacing */}
          

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-900/50 backdrop-blur-sm border border-red-800 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-red-300 text-sm sm:text-base">{error}</p>
              </div>
              <button
                onClick={dismissError}
                className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 bg-green-900/50 backdrop-blur-sm border border-green-800 rounded-xl p-4 flex items-start space-x-3">
              <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5"></div>
              <div className="flex-1">
                <p className="text-green-300 text-sm sm:text-base">{success}</p>
              </div>
              <button
                onClick={dismissSuccess}
                className="text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Access the Admin Panel</h2>
              <p className="text-gray-400 text-sm sm:text-base">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">UserName</label>
                <div className="relative group">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-black/50 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                 
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/50 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 bg-black/50 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
               
                disabled={isLoading}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 via-gray-600 to-cyan-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-purple-700 hover:via-gray-700 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg cursor-pointer shadow-purple-500/25 text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                    ACCESSING...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-gray-900/50 text-gray-400">or </span>
                </div>
              </div>

              
              
            </form>

            {/* Register Link */}
            
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Secured by quantum encryption •{" "}
              <a href="#" className="text-red-400 hover:text-purple-300 transition-colors">
                Help
              </a>{" "}
              •{" "}
              <a href="#" className="text-red-400 hover:text-purple-300 transition-colors">
                Support
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;