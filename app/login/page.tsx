"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, X } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const result = await signIn("credentials", {
        email: email.trim(),
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
        setSuccess("Login successful! Entering in Tandav Gaming...");
        
        // Delay redirect to show success message
        setTimeout(() => {
          router.push("/dashboard");
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
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-sm sm:max-w-md">
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
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative">
              <img 
                src="/logo.jpg" 
                alt="Tandav Logo" 
                className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full shadow-xl ring-2 ring-purple-500/30 bg-black/80 backdrop-blur-sm lg:hidden"
              />
              
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm sm:text-base">Enter your credentials to continue the Tandav</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="your@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-black/50 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/50 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-600 text-sm sm:text-base"
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

                {/* Remember Me */}
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
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 via-gray-600 to-cyan-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/25 text-sm sm:text-base cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                      ACCESSING...
                    </div>
                  ) : (
                    "LOGIN & DO TANDAV"
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-gray-400 text-sm sm:text-base">
                  New to the Tandav?{" "}
                  <button
                    onClick={handleRegisterRedirect}
                    className="text-blue-400 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Password Protected by Bcrypt encryption •{" "}
                Terms •{" "}
                Privacy
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Logo (Hidden on mobile, visible on large screens) */}
        <div className="hidden lg:flex lg:w-1/2 mt-20 justify-center p-4 bg-gradient-to-br text-black">
          <div className="text-center space-y-8">
            {/* Animated Logo */}
            <img 
              src="/logo.jpg" 
              alt="Tandav Logo" 
              className="w-40 h-40 object-contain mx-auto mb-8 rounded-full  ring-4 ring-purple-500/30 hover:scale-110 transition-transform duration-300"
            />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative">
                <h1 className="text-8xl font-black bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-float">
                  TANDAV
                </h1>
                <p className="text-2xl font-bold text-gray-400 mt-2 tracking-widest">GAMING</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-4">
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-purple-500 rounded-full"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <p className="text-xl text-gray-300 font-semibold">Join the Ultimate Gaming Arena</p>
              <p className="text-gray-500">Where Legends Are Born</p>
            </div>

            {/* Animated circles */}
            <div className="flex justify-center space-x-6 mt-12">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-20px); 
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;