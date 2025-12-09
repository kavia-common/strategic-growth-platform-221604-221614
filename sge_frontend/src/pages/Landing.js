import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Zap, Users, TrendingUp, 
  BarChart3, Lock, Clock, Sparkles, Target, 
  Globe, Award 
} from 'lucide-react';
import styles from './Landing.module.css';

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
    <div className={styles.landingPage}>
      {/* Navigation */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.brandSection}>
            <span className={styles.brandLogo}>SGE</span>
            <span className={styles.brandName}>Platform</span>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className={styles.navLink}>
              Log in
            </Link>
            <Link to="/signup" className={styles.navButton}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero Section - Refined with gradient */}
        <section className={styles.heroSection}>
          {/* Decorative elements */}
          <div className={styles.heroDecorative}>
            <div className={styles.heroBlob1}></div>
            <div className={styles.heroBlob2}></div>
          </div>

          <div className={styles.heroContainer}>
            <div className={styles.heroBadge}>
              <Globe size={16} className={styles.heroBadgeIcon} />
              <span className={styles.heroBadgeText}>Trusted by leading organizations worldwide</span>
            </div>

            <h1 className={styles.heroTitle}>
              Drive Growth with
              <br />
              <span className={styles.heroTitleAccent}>AI-Powered Intelligence</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              Transform data into decisions. Empower your team with enterprise-grade analytics, AI insights, and real-time collaboration.
            </p>

            <div className={styles.heroActions}>
              <Link to="/signup" className={styles.heroButtonPrimary}>
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className={styles.heroButtonSecondary}>
                Sign In
              </Link>
            </div>

            {/* Value Props Strip */}
            <div className={styles.valueStrip}>
              <div className={styles.valueItem}>
                <div className={styles.valueNumber}>99.9%</div>
                <div className={styles.valueLabel}>Uptime SLA</div>
              </div>
              <div className={styles.valueItem}>
                <div className={styles.valueNumber}>24/7</div>
                <div className={styles.valueLabel}>Expert Support</div>
              </div>
              <div className={styles.valueItem}>
                <div className={styles.valueNumber}>SOC 2</div>
                <div className={styles.valueLabel}>Certified Security</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - 6 items */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Everything You Need to Succeed</h2>
              <p className={styles.sectionSubtitle}>
                Powerful features designed for modern teams who demand excellence, security, and speed.
              </p>
            </div>

            <div className={styles.featuresGrid}>
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className={`${styles.featureCard} ${styles[`featureCard${feature.colorClass}`]}`}
                >
                  <div className={`${styles.featureIcon} ${styles[`featureIcon${feature.colorClass}`]}`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases / Benefits Section */}
        <section className={styles.useCasesSection}>
          <div className={styles.useCasesContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Built for Your Success</h2>
              <p className={styles.sectionSubtitle}>
                Whether you're planning strategy, tracking growth, or seeking insights, SGE adapts to your needs.
              </p>
            </div>

            <div className={styles.useCasesGrid}>
              {useCases.map((useCase, idx) => (
                <div key={idx} className={styles.useCaseCard}>
                  <div className={styles.useCaseIcon}>
                    <useCase.icon size={32} />
                  </div>
                  <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
                  <p className={styles.useCaseDescription}>
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By / Social Proof */}
        <section className={styles.trustedSection}>
          <div className={styles.trustedContainer}>
            <div className={styles.trustedHeader}>
              <p className={styles.trustedLabel}>
                Trusted by innovative teams worldwide
              </p>
              <div className={styles.trustedLogos}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.trustedLogo}>
                    <Award size={24} className={styles.trustedLogoIcon} />
                    <span className={styles.trustedLogoText}>Company {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaPattern}></div>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Business?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of forward-thinking organizations using SGE to accelerate growth, streamline operations, and make smarter decisions.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/signup" className={styles.ctaButtonPrimary}>
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/login" className={styles.ctaButtonSecondary}>
                Sign In
              </Link>
            </div>
            <p className={styles.ctaDisclaimer}>No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            {/* Brand */}
            <div className={styles.footerBrand}>
              <div className={styles.footerBrandLogo}>
                <span className={styles.footerBrandIcon}>SGE</span>
                <span className={styles.footerBrandName}>Platform</span>
              </div>
              <p className={styles.footerBrandDescription}>
                Empowering organizations with AI-driven intelligence and strategic insights.
              </p>
            </div>

            {/* Product */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerSectionTitle}>Product</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/signup" className={styles.footerLink}>Features</Link></li>
                <li><Link to="/signup" className={styles.footerLink}>Pricing</Link></li>
                <li><Link to="/login" className={styles.footerLink}>Demo</Link></li>
                <li><Link to="/signup" className={styles.footerLink}>API</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerSectionTitle}>Company</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/" className={styles.footerLink}>About</Link></li>
                <li><Link to="/" className={styles.footerLink}>Blog</Link></li>
                <li><Link to="/" className={styles.footerLink}>Careers</Link></li>
                <li><Link to="/" className={styles.footerLink}>Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerSectionTitle}>Legal</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/" className={styles.footerLink}>Privacy</Link></li>
                <li><Link to="/" className={styles.footerLink}>Terms</Link></li>
                <li><Link to="/" className={styles.footerLink}>Security</Link></li>
                <li><Link to="/" className={styles.footerLink}>Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              © {new Date().getFullYear()} Strategic Growth Engine. All rights reserved.
            </p>
            <div className={styles.footerBottomLinks}>
              <Link to="/login" className={styles.footerBottomLink}>
                Status
              </Link>
              <Link to="/login" className={styles.footerBottomLink}>
                Documentation
              </Link>
              <Link to="/login" className={styles.footerBottomLink}>
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
