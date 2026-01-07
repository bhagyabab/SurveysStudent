import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
export const SurveyFooter = () => (
  <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4 text-white">
            <Shield className="w-7 h-7" />
            <span className="text-2xl font-bold">SurveyChain</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            SurveyChain is a blockchain-based e-participation platform that enables
            secure, anonymous, and fair student surveys using Zero-Knowledge Proofs
            and decentralized technologies.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Technology</h4>
          <ul className="space-y-2 text-sm">
            <li>Blockchain Ledger</li>
            <li>Zero-Knowledge Proofs</li>
            <li>Smart Contracts</li>
            <li>Shapley Value Rewards</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: support@surveychain.io</li>
            <li>India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © 2026 <span className="text-white font-semibold">SurveyChain</span>. All rights reserved.
      </div>
    </div>
  </footer>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin'); // admin, moderator, participant
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // ===== ADMIN LOGIN (FRONTEND ONLY) =====
      if (activeTab === 'admin') {
        if (email === 'admin@gmail.com') {
          if (password === 'admin123') {
            toast.success('Admin login successful!');
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('role', 'ADMIN');
            setTimeout(() => navigate('/admin/dashboard'), 1000);
          } else {
            toast.error('Password is incorrect');
          }
        } else {
          toast.error('User not found');
        }
        setLoading(false);
        return;
      }

      // ===== MODERATOR LOGIN =====
      if (activeTab === 'moderator') {
        const res = await axios.get(`http://localhost:8080/api/auth/login/${email}/${password}`);
        if (res.data.loginStatus === 'success' && res.data.role === 'MODERATOR') {
          toast.success('Moderator login successful!');
          sessionStorage.setItem('email', res.data.email);
          sessionStorage.setItem('role', 'MODERATOR');
          setTimeout(() => navigate('/moderator/dashboard'), 1000);
        } else {
          // Show specific messages
          if (res.data.message === 'Password mismatch') toast.error('Password is incorrect');
          else if (res.data.message === 'User not found') toast.error('User not found');
          else toast.error('Login failed');
        }
        setLoading(false);
        return;
      }

      // ===== PARTICIPANT LOGIN =====
      if (activeTab === 'participant') {
        const res = await axios.get(`http://localhost:8080/api/auth/login/${email}/${password}`);
        if (res.data.loginStatus === 'success' && res.data.role === 'PARTICIPANT') {
          toast.success('Participant login successful!');
          sessionStorage.setItem('email', res.data.email);
          sessionStorage.setItem('role', 'PARTICIPANT');
          setTimeout(() => navigate('/participant/dashboard'), 1000);
        } else {
          // Show specific messages
          if (res.data.message === 'Password mismatch') toast.error('Password is incorrect');
          else if (res.data.message === 'User not found') toast.error('User not found');
          else toast.error('Login failed');
        }
        setLoading(false);
        return;
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* ✅ Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">SurveyChain</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">New participant?</span>
            <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your SurveyChain account</p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['admin', 'moderator', 'participant'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveTab(role)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all
                  ${activeTab === role
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {activeTab === "participant" &&
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  New participant?{' '}
                  <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                    Create account here
                  </Link>
                </p>
              </div>
            }
          </form>
        </div>
      </div>
      <SurveyFooter />
    </div>
  );
};

export default LoginPage;
