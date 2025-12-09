import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, Layout } from 'lucide-react';

// PUBLIC_INTERFACE
const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">SGE</span>
            <span className="text-xl font-semibold text-gray-900">Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium no-underline">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary no-underline">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Strategic Growth <span className="text-blue-600">Engine</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Accelerate your business with our multi-tenant SaaS platform featuring AI-powered insights, real-time collaboration, and enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2 no-underline">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg no-underline">
                View Demo
              </Link>
            </div>
            
            {/* Visual Placeholder */}
            <div className="mt-16 relative mx-auto max-w-5xl">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-2 sm:p-4">
                 <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border border-gray-200 overflow-hidden">
                    <div className="text-center p-8">
                        <Layout className="mx-auto h-16 w-16 text-blue-400 mb-4" />
                        <p className="text-gray-400 font-medium">Dashboard Preview</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your organization efficiently and securely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Tenant Security</h3>
                <p className="text-gray-600">
                  Data isolation by default. Manage multiple organizations with role-based access control and secure environments.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl bg-amber-50 border border-amber-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Chat</h3>
                <p className="text-gray-600">
                  Integrated Gemini AI assistant to help analyze trends, answer queries, and boost productivity in real-time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl bg-green-50 border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Updates</h3>
                <p className="text-gray-600">
                  Powered by Supabase for instant data synchronization across all clients. Never miss a critical update.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your business?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of organizations using SGE to drive growth and efficiency.
            </p>
            <Link to="/signup" className="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors no-underline">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="text-xl font-bold text-gray-400">SGE Platform</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Strategic Growth Engine. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
