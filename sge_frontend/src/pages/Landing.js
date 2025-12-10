import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Zap, Users, TrendingUp, 
  BarChart3, Lock, Clock, Sparkles, Target, 
  Globe, Award 
} from 'lucide-react';
import '../styles/Landing.css';

// PUBLIC_INTERFACE
/**
 * Landing Page Component
 * Professional landing page for SGE Platform with hero, features, benefits, and CTA sections.
 * Uses isolated CSS Module for styling to avoid conflicts with other pages.
 * No dashboard preview shown pre-login. Ocean Professional theme applied throughout.
 */
const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and multi-tenant isolation ensure your data stays private and secure.",
      colorClass: "Blue"
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Leverage Gemini AI to analyze trends, generate reports, and make data-driven decisions instantly.",
      colorClass: "Amber"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Role-based access control and real-time updates keep your entire team aligned and productive.",
      colorClass: "Green"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Interactive dashboards and customizable metrics give you complete visibility into your business.",
      colorClass: "Indigo"
    },
    {
      icon: Clock,
      title: "Real-Time Sync",
      description: "Instant data synchronization across all devices ensures everyone works with the latest information.",
      colorClass: "Blue"
    },
    {
      icon: Lock,
      title: "Compliance Ready",
      description: "Built-in compliance features and audit trails help you meet industry standards effortlessly.",
      colorClass: "Amber"
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
    <div className="landingPage">
      {/* Navigation */}
      <header className="header">
        <div className="headerContainer">
          <div className="brandSection">
            <span className="brandLogo">SGE</span>
            <span className="brandName">Platform</span>
          </div>
          <div className="navActions">
            <Link to="/login" className="navLink">
              Log in
            </Link>
            <Link to="/signup" className="navButton">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Hero Section - Refined with gradient */}
        <section className="heroSection">
          {/* Decorative elements */}
          <div className="heroDecorative">
            <div className="heroBlob1"></div>
            <div className="heroBlob2"></div>
          </div>

          <div className="heroContainer">
            <div className="heroBadge">
              <Globe size={16} className="heroBadgeIcon" />
              <span className="heroBadgeText">Trusted by leading organizations worldwide</span>
            </div>

            <h1 className="heroTitle">
              Drive Growth with
              <br />
              <span className="heroTitleAccent">AI-Powered Intelligence</span>
            </h1>
            
            <p className="heroSubtitle">
              Transform data into decisions. Empower your team with enterprise-grade analytics, AI insights, and real-time collaboration.
            </p>

            <div className="heroActions">
              <Link to="/signup" className="heroButtonPrimary">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="heroButtonSecondary">
                Sign In
              </Link>
            </div>

            {/* Value Props Strip */}
            <div className="valueStrip">
              <div className="valueItem">
                <div className="valueNumber">99.9%</div>
                <div className="valueLabel">Uptime SLA</div>
              </div>
              <div className="valueItem">
                <div className="valueNumber">24/7</div>
                <div className="valueLabel">Expert Support</div>
              </div>
              <div className="valueItem">
                <div className="valueNumber">SOC 2</div>
                <div className="valueLabel">Certified Security</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - 6 items */}
        <section className="featuresSection">
          <div className="featuresContainer">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Everything You Need to Succeed</h2>
              <p className="sectionSubtitle">
                Powerful features designed for modern teams who demand excellence, security, and speed.
              </p>
            </div>

            <div className="featuresGrid">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className={`featureCard featureCard${feature.colorClass}`}
                >
                  <div className={`featureIcon featureIcon${feature.colorClass}`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="featureTitle">{feature.title}</h3>
                  <p className="featureDescription">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases / Benefits Section */}
        <section className="useCasesSection">
          <div className="useCasesContainer">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Built for Your Success</h2>
              <p className="sectionSubtitle">
                Whether you're planning strategy, tracking growth, or seeking insights, SGE adapts to your needs.
              </p>
            </div>

            <div className="useCasesGrid">
              {useCases.map((useCase, idx) => (
                <div key={idx} className="useCaseCard">
                  <div className="useCaseIcon">
                    <useCase.icon size={32} />
                  </div>
                  <h3 className="useCaseTitle">{useCase.title}</h3>
                  <p className="useCaseDescription">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By / Social Proof */}
        <section className="trustedSection">
          <div className="trustedContainer">
            <div className="trustedHeader">
              <p className="trustedLabel">
                Trusted by innovative teams worldwide
              </p>
              <div className="trustedLogos">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="trustedLogo">
                    <Award size={24} className="trustedLogoIcon" />
                    <span className="trustedLogoText">Company {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="ctaSection">
          <div className="ctaPattern"></div>
          <div className="ctaContainer">
            <h2 className="ctaTitle">Ready to Transform Your Business?</h2>
            <p className="ctaSubtitle">
              Join thousands of forward-thinking organizations using SGE to accelerate growth, streamline operations, and make smarter decisions.
            </p>
            <div className="ctaActions">
              <Link to="/signup" className="ctaButtonPrimary">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="ctaButtonSecondary">
                Sign In
              </Link>
            </div>
            <p className="ctaDisclaimer">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="footer">
        <div className="footerContainer">
          <div className="footerGrid">
            {/* Brand */}
            <div className="footerBrand">
              <div className="footerBrandLogo">
                <span className="footerBrandIcon">SGE</span>
                <span className="footerBrandName">Platform</span>
              </div>
              <p className="footerBrandDescription">
                Empowering organizations with AI-driven intelligence and strategic insights.
              </p>
            </div>

            {/* Product */}
            <div className="footerSection">
              <h4 className="footerSectionTitle">Product</h4>
              <ul className="footerLinks">
                <li><Link to="/signup" className="footerLink">Features</Link></li>
                <li><Link to="/signup" className="footerLink">Pricing</Link></li>
                <li><Link to="/login" className="footerLink">Demo</Link></li>
                <li><Link to="/signup" className="footerLink">API</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footerSection">
              <h4 className="footerSectionTitle">Company</h4>
              <ul className="footerLinks">
                <li><Link to="/" className="footerLink">About</Link></li>
                <li><Link to="/" className="footerLink">Blog</Link></li>
                <li><Link to="/" className="footerLink">Careers</Link></li>
                <li><Link to="/" className="footerLink">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footerSection">
              <h4 className="footerSectionTitle">Legal</h4>
              <ul className="footerLinks">
                <li><Link to="/" className="footerLink">Privacy</Link></li>
                <li><Link to="/" className="footerLink">Terms</Link></li>
                <li><Link to="/" className="footerLink">Security</Link></li>
                <li><Link to="/" className="footerLink">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="footerBottom">
            <p className="footerCopyright">
              © {new Date().getFullYear()} Strategic Growth Engine. All rights reserved.
            </p>
            <div className="footerBottomLinks">
              <Link to="/login" className="footerBottomLink">
                Status
              </Link>
              <Link to="/login" className="footerBottomLink">
                Documentation
              </Link>
              <Link to="/login" className="footerBottomLink">
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
