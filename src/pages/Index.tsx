
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Logo from '@/assets/Logo';

const HeroSection = () => {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className="h1 text-gradient mb-6">
            The Next Evolution in <span className="text-emerald">Peer-to-Peer</span> Poker
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Join thousands of players in the most secure, transparent, and rewarding online poker experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="animate-pulse-glow">
              Play Now
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Peer-to-Peer Technology",
      description: "Our decentralized platform enables direct player-to-player matches without house edge.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0V4m0 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
        </svg>
      )
    },
    {
      title: "Fast Tournaments",
      description: "Jump into daily tournaments with various buy-ins and win substantial prize pools.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Secure Payments",
      description: "Instant deposits and withdrawals with multiple payment methods and top-tier security.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "VIP Rewards",
      description: "Earn exclusive rewards, cashback, and special tournament entries as you play.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-20 bg-navy/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h2 mb-4">World-Class <span className="text-gold">Features</span></h2>
          <p className="text-gray-300">
            PokerP2P offers the most advanced online poker experience with cutting-edge technology and player-focused design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-lg border border-emerald/10 hover:border-emerald/30 transition-colors shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatisticsSection = () => {
  const stats = [
    { value: "5M+", label: "Players" },
    { value: "$250M+", label: "Total Prizes" },
    { value: "10K+", label: "Daily Tournaments" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="bg-gradient-to-b from-navy to-navy/90 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="value text-emerald text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <p className="text-gold uppercase tracking-wider text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "The smoothest poker platform I've ever played on. The tournaments are competitive and the interface is intuitive.",
      author: "Alex M.",
      role: "Professional Player"
    },
    {
      quote: "I love the VIP program and how quickly they process withdrawals. It's clear they really care about the player experience.",
      author: "Sarah T.",
      role: "Regular Tournament Player"
    },
    {
      quote: "As someone new to poker, I found the tutorials incredibly helpful and the community very welcoming.",
      author: "Miguel R.",
      role: "Casual Player"
    }
  ];

  return (
    <div className="py-20 bg-navy/70">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h2 mb-4">What Our <span className="text-emerald">Players</span> Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-card p-8 rounded-lg border border-emerald/10 shadow-lg relative"
            >
              <svg className="h-8 w-8 text-gold/30 absolute top-4 left-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z"/>
              </svg>
              <p className="text-white mb-6 italic">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-emerald/20 text-emerald flex items-center justify-center font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="text-gold font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CallToActionSection = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-emerald/10 via-navy to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="h2 mb-6">Ready to Join the Table?</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Sign up today and receive a welcome bonus to kickstart your poker journey. Join thousands of players already enjoying PokerP2P.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" className="animate-pulse-glow">
            Sign Up Now
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <StatisticsSection />
        <TestimonialSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
