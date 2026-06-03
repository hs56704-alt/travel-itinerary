import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
  Plane, Upload, Sparkles, Share2,
  FileText, CheckCircle, ArrowRight, Zap
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Upload Any Travel Document',
    desc: 'Flight tickets, hotel bookings, train passes — PDF or image, we handle it all.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Sparkles,
    title: 'AI Builds Your Itinerary',
    desc: 'Claude AI reads your documents and creates a detailed day-by-day travel plan.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Share2,
    title: 'Share With Anyone',
    desc: 'Generate a public link and share your itinerary with travel companions instantly.',
    color: 'bg-green-100 text-green-600',
  },
];

const steps = [
  { step: '01', title: 'Upload Documents', desc: 'Drag & drop your flight tickets, hotel bookings, or any travel docs.' },
  { step: '02', title: 'AI Extracts & Plans', desc: 'Our AI reads every detail and organizes your trip into a structured plan.' },
  { step: '03', title: 'Get Your Itinerary', desc: 'Receive a complete day-by-day itinerary with activities, tips, and booking details.' },
];

export default function Landing() {
  const { user } = useAuth();

  // Redirect logged-in users to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Plane size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">TripAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-800 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap size={14} /> Powered by Claude AI
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Turn your bookings into a{' '}
            <span className="text-blue-600">perfect itinerary</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your flight tickets, hotel confirmations, and travel documents.
            AI instantly builds you a complete day-by-day travel plan.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition shadow-lg shadow-blue-200"
            >
              Start planning free <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-2xl text-lg transition"
            >
              Sign in
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500 text-lg">Plan smarter trips in seconds, not hours</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 text-lg">Three simple steps to your perfect trip</p>
          </div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-6 bg-white rounded-2xl p-6 border border-gray-100">
                <span className="text-3xl font-black text-blue-100">{s.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{s.title}</h3>
                  <p className="text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Documents */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Works with all your travel docs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Flight Tickets', 'Hotel Bookings', 'Train Passes', 'Travel Vouchers'].map((doc) => (
              <div key={doc} className="flex items-center gap-2 bg-gray-50 rounded-xl p-4 justify-center">
                <CheckCircle size={16} className="text-green-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to plan smarter?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of travelers who plan their trips with AI
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-blue-50 transition"
          >
            Get started free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-blue-600 text-white p-1 rounded-md">
            <Plane size={14} />
          </div>
          <span className="text-white font-semibold">TripAI</span>
        </div>
        <p>© {new Date().getFullYear()} TripAI. Built with React, Node.js & Claude AI.</p>
      </footer>
    </div>
  );
}