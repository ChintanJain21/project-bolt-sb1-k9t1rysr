import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

// Enhanced toast notification with smooth animations
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-300">
    <div
      className={`p-4 rounded-xl shadow-2xl backdrop-blur-sm border transform transition-all duration-300 ${
        type === 'success' 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? 
          <CheckCircle className="w-5 h-5 text-emerald-600" /> : 
          <AlertCircle className="w-5 h-5 text-red-600" />
        }
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
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
  } = useSignUpEmailPassword();

  const isLoading = signInLoading || signUpLoading;
  const isError = signInError || signUpError;
  const errorMessage = signInErrorMsg?.message || signUpErrorMsg?.message;

  // Handle successful signup - switch to login mode
  useEffect(() => {
    if (signUpSuccess) {
      setToast({
        message: 'Account created successfully! Switching to sign in...',
        type: 'success',
      });

      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setIsSignUp(false);

      setTimeout(() => {
        setToast({
          message: 'Now please sign in with your new account',
          type: 'success',
        });
      }, 1500);

      setTimeout(() => {
        setToast(null);
      }, 4000);
    }
  }, [signUpSuccess]);

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
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative mx-auto mb-6">
            <div className="bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-700 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-transform duration-300">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl -z-10"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Welcome to ChatApp
          </h1>
          <p className="text-gray-600 text-lg">
            {isSignUp ? 'Create your account to get started' : 'Sign in to continue your conversations'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-25"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
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
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required={isSignUp}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors duration-200"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || signUpSuccess}
                className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <User className="w-5 h-5" />
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </button>
            </form>

            {/* Toggle between Sign In/Sign Up */}
            <div className="mt-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200 hover:underline underline-offset-4"
                disabled={isLoading || signUpSuccess}
              >
                {isSignUp ? 'Sign In Instead' : 'Create Account'}
              </button>
              
              <button
                type="button"
                onClick={clearForm}
                className="block mx-auto text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isLoading}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure authentication powered by Nhost</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;