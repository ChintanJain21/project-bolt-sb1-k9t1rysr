import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

// Enhanced toast notification with dark theme
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-300">
    <div
      className={`p-4 rounded-xl shadow-2xl backdrop-blur-lg border transform transition-all duration-300 ${
        type === 'success' 
          ? 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100' 
          : 'bg-red-900/90 border-red-700/50 text-red-100'
      }`}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? 
          <CheckCircle className="w-5 h-5 text-emerald-400" /> : 
          <AlertCircle className="w-5 h-5 text-red-400" />
        }
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
            ×
          </div>
        </button>
      </div>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    signInEmailPassword,
    isLoading: signInLoading,
    isSuccess: signInSuccess,
    isError: signInError,
    error: signInErrorMsg,
  } = useSignInEmailPassword();

  const {
    signUpEmailPassword,
    isLoading: signUpLoading,
    isSuccess: signUpSuccess,
    isError: signUpError,
    error: signUpErrorMsg,
    needsEmailVerification,
  } = useSignUpEmailPassword();

  const isLoading = signInLoading || signUpLoading;
  const isError = signInError || signUpError;
  const errorMessage = signInErrorMsg?.message || signUpErrorMsg?.message;

  // Handle successful signup - switch to login mode
  useEffect(() => {
    if (signUpSuccess || needsEmailVerification) {
      setIsTransitioning(true);
      
      setToast({
        message: needsEmailVerification 
          ? 'Account created! Please check your email to verify, then sign in here.'
          : 'Account created successfully! Please sign in with your new account.',
        type: 'success',
      });

      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);

      const switchTimer = setTimeout(() => {
        setIsSignUp(false);
        setIsTransitioning(false);
      }, 800);

      const toastTimer = setTimeout(() => {
        setToast(null);
      }, 6000);

      return () => {
        clearTimeout(switchTimer);
        clearTimeout(toastTimer);
      };
    }
  }, [signUpSuccess, needsEmailVerification]);

  // Handle successful login
  useEffect(() => {
    if (signInSuccess) {
      setToast({
        message: 'Login successful! Welcome back!',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  }, [signInSuccess, navigate]);

  // Handle errors
  useEffect(() => {
    if (isError && errorMessage) {
      setToast({
        message: errorMessage,
        type: 'error',
      });

      setTimeout(() => {
        setToast(null);
      }, 5000);
    }
  }, [isError, errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (password !== confirmPassword) {
        setToast({ message: 'Passwords do not match', type: 'error' });
        return;
      }
      if (password.length < 8) {
        setToast({ message: 'Password must be at least 8 characters long', type: 'error' });
        return;
      }
      await signUpEmailPassword(email, password);
    } else {
      await signInEmailPassword(email, password);
    }
  };

  const toggleMode = () => {
    setToast(null);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsSignUp(!isSignUp);
    setIsTransitioning(false);
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <>
      {/* Toast at top level */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden" 
           style={{ 
             minHeight: '100vh', 
             
             overscrollBehavior: 'none'
           }}>
        {/* Extended background to prevent white showing */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black -z-10" 
             style={{ 
               top: '-100px', 
               bottom: '-100px', 
               left: '-100px', 
               right: '-100px' 
             }}></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-600/30 to-purple-800/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-600/30 to-cyan-800/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400/60 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce delay-1000"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative mx-auto mb-8">
              <div className="bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-700 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                <MessageCircle className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-tr from-violet-600/30 to-purple-600/30 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
              <div className="absolute -inset-6 bg-gradient-to-tr from-violet-600/10 to-purple-600/10 rounded-full blur-3xl -z-20"></div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4 tracking-tight">
              AI ChatBot
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
              {isSignUp ? 'Create your account to chat with our intelligent AI assistant' : 'Welcome back! Continue your conversation with AI'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/50 to-purple-600/50 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 hover:border-gray-600/50 transition-all duration-500">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300">
                      <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-violet-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-gray-800/70 transition-all duration-300 placeholder-gray-500 text-white"
                      placeholder="Enter your email"
                      disabled={isLoading || isTransitioning}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/0 via-purple-600/0 to-violet-600/0 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300">
                      <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-violet-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-gray-800/70 transition-all duration-300 placeholder-gray-500 text-white"
                      placeholder="Enter your password"
                      disabled={isLoading || isTransitioning}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-700/30 rounded-r-2xl transition-colors duration-300"
                      disabled={isLoading || isTransitioning}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/0 via-purple-600/0 to-violet-600/0 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-gray-500 ml-1">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>

                {/* Confirm Password Field (Sign Up Only) */}
                <div className={`transition-all duration-500 ease-out ${
                  isSignUp ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'
                }`}>
                  {isSignUp && (
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300">
                          <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-violet-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required={isSignUp}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-gray-800/70 transition-all duration-300 placeholder-gray-500 text-white"
                          placeholder="Confirm your password"
                          disabled={isLoading || isTransitioning}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-700/30 rounded-r-2xl transition-colors duration-300"
                          disabled={isLoading || isTransitioning}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                          )}
                        </button>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/0 via-purple-600/0 to-violet-600/0 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isTransitioning}
                  className="relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                    </div>
                  ) : isTransitioning ? (
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <CheckCircle className="w-5 h-5" />
                      <span>Account Created! Switching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <User className="w-5 h-5" />
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </button>
              </form>

              {/* Toggle between Sign In/Sign Up */}
              <div className="mt-8 text-center space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900/60 text-gray-400">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-all duration-300 hover:underline underline-offset-4 decoration-2 decoration-violet-400/50 transform hover:scale-105"
                  disabled={isLoading || isTransitioning}
                >
                  {isSignUp ? 'Sign In Instead' : 'Create Account'}
                </button>
                
                <button
                  type="button"
                  onClick={clearForm}
                  className="block mx-auto text-sm text-gray-500 hover:text-gray-400 transition-colors duration-300 hover:underline underline-offset-2"
                  disabled={isLoading}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              <span>Secure authentication powered by Nhost</span>
            </div>
            <div className="text-xs text-gray-600">
              Protected by enterprise-grade security
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;