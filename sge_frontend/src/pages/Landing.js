import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Zap, Users, TrendingUp, 
  BarChart3, Lock, Clock, Sparkles, Target, 
  Globe, Award 
} from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Landing Page Component
 * Professional landing page for SGE Platform with hero, features, benefits, and CTA sections.
 * No dashboard preview shown pre-login. Ocean Professional theme applied throughout.
 */
const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and multi-tenant isolation ensure your data stays private and secure.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Leverage Gemini AI to analyze trends, generate reports, and make data-driven decisions instantly.",
      color: "amber"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Role-based access control and real-time updates keep your entire team aligned and productive.",
      color: "green"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Interactive dashboards and customizable metrics give you complete visibility into your business.",
      color: "indigo"
    },
    {
      icon: Clock,
      title: "Real-Time Sync",
      description: "Instant data synchronization across all devices ensures everyone works with the latest information.",
      color: "blue"
    },
    {
      icon: Lock,
      title: "Compliance Ready",
      description: "Built-in compliance features and audit trails help you meet industry standards effortlessly.",
      color: "amber"
    }
  ];

  const useCases = [
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Align your team on goals, track progress, and adjust strategies with AI-powered recommendations."
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Monitor KPIs, identify opportunities, and accelerate growth with comprehensive business intelligence."
    },
    {
      icon: Sparkles,
      title: "AI Consultation",
      description: "Get instant answers to complex business questions and receive actionable insights from your data."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">SGE</span>
            <span className="text-xl font-semibold text-gray-900">Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium no-underline transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary no-underline">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Refined with gradient */}
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-40" style={{
          background: 'linear-gradient(135deg, #EEF2FF 0%, #DBEAFE 25%, #FFFFFF 100%)'
        }}>
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Globe size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Trusted by leading organizations worldwide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
              Drive Growth with
              <br />
              <span className="text-blue-600">AI-Powered Intelligence</span>
            </h1>
            
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Transform data into decisions. Empower your team with enterprise-grade analytics, AI insights, and real-time collaboration.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link to="/signup" className="btn btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 no-underline shadow-lg hover:shadow-xl transition-all">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary px-8 py-4 text-lg no-underline">
                Sign In
              </Link>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
              <div className="flex flex-col items-center border-l-0 sm:border-l border-gray-300">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Expert Support</div>
              </div>
              <div className="flex flex-col items-center border-l-0 sm:border-l border-gray-300">
                <div className="text-3xl font-bold text-blue-600 mb-2">SOC 2</div>
                <div className="text-sm text-gray-600">Certified Security</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Expanded to 6 items */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed for modern teams who demand excellence, security, and speed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className={`p-8 rounded-xl bg-${feature.color}-50 border border-${feature.color}-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-5`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases / Benefits Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Your Success</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're planning strategy, tracking growth, or seeking insights, SGE adapts to your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {useCases.map((useCase, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md">
                    <useCase.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By / Social Proof */}
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
                Trusted by innovative teams worldwide
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Award size={24} className="text-gray-400" />
                    <span className="text-lg font-semibold text-gray-400">Company {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-blue-100 text-xl mb-10 leading-relaxed">
              Join thousands of forward-thinking organizations using SGE to accelerate growth, streamline operations, and make smarter decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-10 py-4 rounded-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl no-underline text-lg">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-bold px-10 py-4 rounded-lg hover:bg-white hover:text-blue-900 transition-all no-underline text-lg">
                Sign In
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-blue-400">SGE</span>
                <span className="text-xl font-semibold text-white">Platform</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Empowering organizations with AI-driven intelligence and strategic insights.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-white transition-colors no-underline">Features</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors no-underline">Pricing</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors no-underline">Demo</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors no-underline">API</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors no-underline">About</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Blog</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Careers</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Privacy</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Terms</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Security</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors no-underline">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Strategic Growth Engine. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm hover:text-white transition-colors no-underline">
                Status
              </Link>
              <Link to="/login" className="text-sm hover:text-white transition-colors no-underline">
                Documentation
              </Link>
              <Link to="/login" className="text-sm hover:text-white transition-colors no-underline">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
