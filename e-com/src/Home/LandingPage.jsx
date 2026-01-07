import { useState } from 'react';
import { Shield, Lock, Award, Database, UserCheck, ChevronRight, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

export const SurveyFooter = () => (
  <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
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
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
            {/*<li><a href="/signup" className="hover:text-white">Register</a></li>*/}
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

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = () => {
    if (email) {
      alert('Thank you for your interest! We will contact you soon.');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">SurveyChain</span>
          </div>
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <div className={`${menuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent shadow-lg lg:shadow-none p-6 lg:p-0 gap-8 items-center`}>
            <a href="#home" className="font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#features" className="font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>How It Works</a>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8 z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Blockchain-Powered E-Participation</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Secure Student Surveys with
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent"> Zero-Knowledge Privacy</span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Participate in surveys anonymously using advanced Zero-Knowledge Proofs.
              Earn fair rewards based on your genuine contributions through Shapley Value algorithms.
              All data secured on an immutable blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all">
                Start Survey <ChevronRight className="w-5 h-5" />
              </button>
              {/*<button className="bg-white/15 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/25 transition-all">
                Watch Demo
              </button>*/}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {[
                { num: '100%', label: 'Privacy Protected' },
                { num: '50%', label: 'Faster Sampling' },
                { num: 'Fair', label: 'Reward System' },
                { num: 'Secure', label: 'Blockchain Based' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{stat.num}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block h-[500px]">
            <div className="absolute top-[10%] left-[5%] bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="font-semibold">Verified</span>
            </div>
            <div className="absolute top-[45%] right-[10%] bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce" style={{ animationDelay: '2s' }}>
              <Lock className="w-8 h-8 text-purple-500" />
              <span className="font-semibold">Private</span>
            </div>
            <div className="absolute bottom-[10%] left-[25%] bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce" style={{ animationDelay: '4s' }}>
              <Award className="w-8 h-8 text-orange-500" />
              <span className="font-semibold">Rewarded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-4">Advanced Technology Features</h2>
          <p className="text-lg text-center text-gray-600 mb-16">Built with cutting-edge blockchain and cryptographic solutions</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Lock className="w-8 h-8" />, title: 'Zero-Knowledge Proofs', desc: 'Prove your eligibility without revealing personal information. Complete anonymity guaranteed.', gradient: 'from-blue-500 to-blue-700' },
              { icon: <UserCheck className="w-8 h-8" />, title: 'Attribute Sampling', desc: 'Efficient participant selection using attribute keys without compromising privacy.', gradient: 'from-purple-500 to-purple-700' },
              { icon: <Award className="w-8 h-8" />, title: 'Shapley Value Rewards', desc: 'Fair compensation based on contribution quality using game theory.', gradient: 'from-orange-500 to-orange-700' },
              { icon: <Database className="w-8 h-8" />, title: 'Blockchain Security', desc: 'Immutable and transparent records on decentralized ledger.', gradient: 'from-green-500 to-green-700' }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-center text-gray-600 mb-16">Simple process, powerful technology</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Register', desc: 'Create your account with student credentials. Quick and secure registration process.' },
              { num: '02', title: 'Verify Identity', desc: 'Prove eligibility using Zero-Knowledge Proofs without revealing your personal information.' },
              { num: '03', title: 'Participate', desc: 'Complete surveys anonymously. Your responses are encrypted and secured on blockchain.' },
              { num: '04', title: 'Earn Rewards', desc: 'Get compensated fairly based on contribution quality using Shapley Value calculations.' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">Why Students Choose SurveyChain</h2>
              <ul className="space-y-4">
                {[
                  'Complete anonymity with zero-knowledge verification',
                  'Fair rewards for genuine participation',
                  'Transparent and tamper-proof results',
                  'No central authority - fully decentralized',
                  'Instant verification and participation',
                  'Protected against manipulation and fraud'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Database className="w-10 h-10" />, label: 'Blockchain Secured' },
                { icon: <Shield className="w-10 h-10" />, label: 'Privacy First' },
                { icon: <Award className="w-10 h-10" />, label: 'Fair Rewards' }
              ].map((box, i) => (
                <div key={i} className={`${i === 2 ? 'col-span-2' : ''} bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl text-white flex flex-col items-center justify-center gap-4 text-center font-semibold`}>
                  {box.icon}
                  <span>{box.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <SurveyFooter />


    </div>
  );
};

export default LandingPage;