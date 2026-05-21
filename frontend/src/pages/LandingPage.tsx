import { motion } from 'framer-motion';
import { ArrowUpRight, Users, ShieldCheck, Star, DollarSign, Clock, BarChart3, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <section className="relative min-h-screen bg-dark-bg overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A]"></div>
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-[rgba(139,92,246,0.1)] via-[rgba(6,182,212,0.05)] to-[transparent] pointer-events-none" style={{ width: '200%', height: '200%' }}></div>
          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary-500/10 rounded-full blur-3xl animate-float delay-200"></div>
          <div className="absolute bottom-1/3 right-1/5 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl animate-float delay-400"></div>
          <div className="absolute top-1/6 right-1/6 w-16 h-16 bg-accent-pink/10 rounded-full blur-3xl animate-float delay-600"></div>
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 text-center text-dark-text">
          {/* Hero Content */}
          <div className="max-w-4xl space-y-8">
            {/* Animated Heading */}
            <motion.h1 
              initial={{ x: -100, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="text-5xl font-bold text-gradient mb-6"
            >
              Find Your Perfect Freelancer Match
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-dark-muted max-w-2xl mx-auto"
            >
              Connect with top-tier freelancers for your next project. Hire talent, manage work, and get paid securely—all in one platform.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/login" className="btn btn-primary btn-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/projects" className="btn btn-secondary btn-lg px-8 py-3">
                Explore Talent
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.6, yoyo: Infinity }}
            className="absolute bottom-8"
          >
            <ArrowUpRight className="w-8 h-8 text-dark-muted animate-bounce" />
          </motion.div>
        </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 bg-dark-surface/50">
          <div className="container-custom">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-center mb-12"
            >
              Trusted by Thousands of Professionals
            </motion.h2>
            
            <div className="grid-auto">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center"
                >
                  <Users className="w-6 h-6 text-primary-400" />
                </motion.div>
                <motion.h3 className="text-2xl font-bold text-primary-400">
                  50K+
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Active Freelancers
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-accent-cyan/20 rounded-lg flex items-center justify-center"
                >
                  <ShieldCheck className="w-6 h-6 text-accent-cyan" />
                </motion.div>
                <motion.h3 className="text-2xl font-bold text-accent-cyan">
                  100K+
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Successful Projects
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-accent-pink/20 rounded-lg flex items-center justify-center"
                >
                  <Star className="w-6 h-6 text-accent-pink" />
                </motion.div>
                <motion.h3 className="text-2xl font-bold text-accent-pink">
                  4.8
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Average Rating
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center"
                >
                  <DollarSign className="w-6 h-6 text-primary-400" />
                </motion.div>
                <motion.h3 className="text-2xl font-bold text-primary-400">
                  $2M+
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Total Earnings
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20">
          <div className="container-custom">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-center mb-12"
            >
              Why Choose Freelancerzz?
            </motion.h2>
            
            <div className="grid-auto">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="card-hover"
              >
                <motion.div className="w-14 h-14 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary-400" />
                </motion.div>
                <motion.h3 className="text-xl font-bold mb-2">
                  Time Tracking
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Track billable hours with precision and generate accurate invoices automatically.
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.4 }}
                className="card-hover"
              >
                <motion.div className="w-14 h-14 bg-accent-cyan/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent-cyan" />
                </motion.div>
                <motion.h3 className="text-xl font-bold mb-2">
                  Team Collaboration
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Seamlessly communicate with clients and team members through integrated messaging.
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.6 }}
                className="card-hover"
              >
                <motion.div className="w-14 h-14 bg-accent-pink/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-accent-pink" />
                </motion.div>
                <motion.h3 className="text-xl font-bold mb-2">
                  Secure Payments
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Escrow protection ensures freelancers get paid and clients receive quality work.
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.8 }}
                className="card-hover"
              >
                <motion.div className="w-14 h-14 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary-400" />
                </motion.div>
                <motion.h3 className="text-xl font-bold mb-2">
                  Analytics & Reports
                </motion.h3>
                <motion.p className="text-dark-muted text-center">
                  Gain insights into your productivity, earnings, and project performance.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-20 bg-dark-surface/30">
          <div className="container-custom">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-center mb-12"
            >
              What Our Users Say
            </motion.h2>
            
            <div className="grid-auto">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="card-hover"
              >
                <motion.p className="text-dark-text/90 italic mb-4">
                  "Freelancerzz has transformed how I manage my freelance business. The interface is intuitive, payments are secure, and I've doubled my income since joining."
                </motion.p>
                <motion.div className="flex items-center space-x-3">
                  <motion.div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <motion.img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                      alt="Freelancer testimonial" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                  <motion.div className="text-left">
                    <motion.h3 className="font-semibold text-dark-text">Alex Rivera</motion.h3>
                    <motion.p className="text-dark-muted text-sm">Senior Developer</motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.4 }}
                className="card-hover"
              >
                <motion.p className="text-dark-text/90 italic mb-4">
                  "As a client, I love how easy it is to find skilled freelancers, review their work, and manage payments all in one platform. Highly recommend!"
                </motion.p>
                <motion.div className="flex items-center space-x-3">
                  <motion.div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                    <motion.img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                      alt="Client testimonial" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                  <motion.div className="text-left">
                    <motion.h3 className="font-semibold text-dark-text">Samira Chen</motion.h3>
                    <motion.p className="text-dark-muted text-sm">Product Manager</motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.6 }}
                className="card-hover"
              >
                <motion.p className="text-dark-text/90 italic mb-4">
                  "The time tracking feature alone has saved me hours each week. Invoicing is automatic, and I've never had a payment dispute."
                </motion.p>
                <motion.div className="flex items-center space-x-3">
                  <motion.div className="w-10 h-10 bg-accent-pink/20 rounded-lg flex items-center justify-center">
                    <motion.img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                      alt="Freelancer testimonial" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                  <motion.div className="text-left">
                    <motion.h3 className="font-semibold text-dark-text">Jordan Lee</motion.h3>
                    <motion.p className="text-dark-muted text-sm">UX Designer</motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted Companies Section */}
        <section className="relative py-16">
          <div className="container-custom">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.8 }}
              className="text-2xl font-bold text-center mb-10"
            >
              Trusted by Leading Companies
            </motion.h2>
            
            <div className="flex flex-wrap gap-8 justify-center">
              {/* Company Logos - Placeholder */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 w-48 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <motion.img 
                  src="https://via.placeholder.com/150x50/8B5CF6/FFFFFF?text=Company+One" 
                  alt="Company One" 
                  className="h-8"
                />
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex-1 w-48 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <motion.img 
                  src="https://via.placeholder.com/150x50/06B6D4/FFFFFF?text=Company+Two" 
                  alt="Company Two" 
                  className="h-8"
                />
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex-1 w-48 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <motion.img 
                  src="https://via.placeholder.com/150x50/F43F5E/FFFFFF?text=Company+Three" 
                  alt="Company Three" 
                  className="h-8"
                />
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex-1 w-48 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <motion.img 
                  src="https://via.placeholder.com/150x50/8B5CF6/FFFFFF?text=Company+Four" 
                  alt="Company Four" 
                  className="h-8"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 bg-dark-card/50 backdrop-blur-sm border-t border-dark-border/30">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-col lg:flex-row items-center lg:items-start gap-4"
              >
                <motion.div className="flex items-center space-x-3">
                  <motion.div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-primary-400" />
                  </motion.div>
                  <span className="font-semibold text-dark-text">Freelancerzz</span>
                </motion.div>
                <motion.p className="text-dark-muted text-center lg:text-left">
                  Connecting talent with opportunity since 2026.
                </motion.p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col lg:flex-row lg:space-x-8 gap-4"
              >
                <motion.Link to="/projects" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Find Talent
                </motion.Link>
                <motion.Link to="/login" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Sign Up
                </motion.Link>
                <motion.Link to="/login" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Log In
                </motion.Link>
                <motion.Link to="/projects" className="text-dark-muted hover:text-primary-400 transition-colors">
                  How It Works
                </motion.Link>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex-col lg:flex-row items-center lg:items-end gap-4"
              >
                <motion.p className="text-dark-muted">
                  © 2026 Freelancerzz. All rights reserved.
                </motion.p>
                <motion.div className="flex space-x-4">
                  <motion.a href="#" className="text-dark-muted hover:text-primary-400 transition-colors">
                    <Users className="w-5 h-5" />
                  </motion.a>
                  <motion.a href="#" className="text-dark-muted hover:text-primary-400 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.a>
                  <motion.a href="#" className="text-dark-muted hover:text-primary-400 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </footer>
      </motion.div>
  );
};

export default LandingPage;