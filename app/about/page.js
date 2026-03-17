"use client";

import React from 'react';
import Link from 'next/link';

const AboutContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 mx-auto">
                <img 
                  src="/tea.gif" 
                  alt="Chai" 
                  className="w-full h-full object-contain animate-float"
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            About Get Me a Chai
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A crowdfunding platform designed for creators to fund their projects with the support of their fans.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Get Me a Chai is a space where your fans can directly contribute to your creative endeavors 
              by buying you a chai. Unlock the potential of your fanbase and bring your projects to life.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: "/group.gif",
                title: "Fans Want to Collaborate",
                description: "Your fans are enthusiastic about collaborating with you on your projects.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "/coin.gif",
                title: "Support Through Chai",
                description: "Receive support from your fans in the form of chai purchases, directly contributing to your project funding.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "/man.gif",
                title: "Build Your Community",
                description: "Engage with your fans on a more personal level and build lasting relationships.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "/group.gif",
                title: "Launch Projects",
                description: "Use the funds to launch and grow your creative projects with confidence.",
                color: "from-orange-500 to-red-500"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-purple-500 transition-all transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-1 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                      <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Get Me a Chai
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Direct Financial Support",
                description: "Get direct financial support from your fanbase",
                icon: "💰"
              },
              {
                title: "Personal Engagement",
                description: "Engage with your fans on a more personal level",
                icon: "🤝"
              },
              {
                title: "Tailored Platform",
                description: "Access a platform tailored for creative projects",
                icon: "🎨"
              },
              {
                title: "Exclusive Rewards",
                description: "Offer exclusive rewards and perks to supporters",
                icon: "🎁"
              },
              {
                title: "Community Building",
                description: "Be part of the creative process and connect with creators",
                icon: "👥"
              },
              {
                title: "Resource Access",
                description: "Gain access to tutorials, templates, and tools",
                icon: "📚"
              },
              {
                title: "Global Recognition",
                description: "Showcase your work to a global audience",
                icon: "🌍"
              },
              {
                title: "Portfolio Building",
                description: "Build your portfolio and increase credibility",
                icon: "📈"
              },
              {
                title: "Industry Insights",
                description: "Stay updated on industry trends and best practices",
                icon: "💡"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="group bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-purple-500 transition-all hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Active Creators" },
              { number: "10K+", label: "Happy Supporters" },
              { number: "50K+", label: "Chais Bought" },
              { number: "₹1Cr+", label: "Funds Raised" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Creators Say
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "Get Me a Chai helped me fund my first project. The support from my fans was incredible!",
                author: "Priya Sharma",
                role: "Artist"
              },
              {
                quote: "The platform is easy to use and my fans love the concept of buying me a chai to support my work.",
                author: "Rahul Verma",
                role: "Content Creator"
              },
              {
                quote: "I've connected with so many amazing people through this platform. It's more than just funding.",
                author: "Anjali Singh",
                role: "Writer"
              },
              {
                quote: "The best decision I made for my creative journey. Highly recommended for all creators!",
                author: "Vikram Mehta",
                role: "Filmmaker"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <p className="text-gray-300 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-bold text-purple-400">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-12 border border-purple-500/30 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Journey?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are already funding their projects with fan support.
            </p>
            <Link href="/login">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default AboutContent;