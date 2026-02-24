
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const ProfilePage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'UI/UX Design',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully!'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          projectType: 'UI/UX Design',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-['Manrope']">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">terminal</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Asif Raza
              </h2>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#work" className="text-gray-300 hover:text-white transition-colors">
                Selected Work
              </a>
              <a href="#expertise" className="text-gray-300 hover:text-white transition-colors">
                Expertise
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </nav>

            {/* Home Button */}
            <Link href="/">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105">
                Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Image Column */}
            <div className="md:w-1/2 relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                {/* Profile Image */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-black rounded-full overflow-hidden">
                  <img
                    src="https://i.postimg.cc/76P2BCcT/asifraz-a-20250527-0001.jpg"
                    alt="Asif Raza"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Location Badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 px-4 py-2 rounded-full border border-gray-700 whitespace-nowrap">
                  <p className="text-xs text-gray-400">Based in</p>
                  <p className="text-sm font-semibold">Kolkata, India</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:w-1/2 text-center md:text-left">
              <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium mb-6">
                Product Designer & Developer
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Hello I am{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Asif.
                </span>
              </h1>

              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                I build digital products that combine aesthetic precision with functional excellence.
                Specializing in high-performance web applications and intuitive UI/UX systems.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                <a href="#work">
                  <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-105">
                    View My Work
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </a>
                <a href="#contact">
                  <button className="border border-gray-700 hover:border-purple-600 px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105">
                    Let Connect
                  </button>
                </a>

                <Link href="/payments">
                  <button className="group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-105">
                    <span className="material-symbols-outlined">favorite</span>
                    Support My Work
                  </button>
                </Link>

              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start">
                {[
                  { href: "https://instagram.com", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { href: "https://youtube.com", label: "YouTube", path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.612 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" },
                  { href: "https://facebook.com", label: "Facebook", path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-900 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section id="expertise" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Expertise</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "design_services", title: "UI/UX Design", desc: "Creating visually stunning and highly intuitive digital interfaces with a user-first mindset." },
                { icon: "code", title: "Frontend Dev", desc: "Building performant, responsive, and accessible web applications using modern frameworks." },
                { icon: "token", title: "Branding", desc: "Developing unique visual identities and brand languages that resonate with target audiences." },
                { icon: "rocket_launch", title: "Product Strategy", desc: "Planning roadmaps and optimizing user flows to achieve business goals." },
              ].map((item) => (
                <div key={item.title} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-600 transition-all transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Works</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto md:mx-0"></div>
              </div>
              <a href="#" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mt-4 md:mt-0">
                All Projects
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video">
                    <img
                      src={`https://picsum.photos/600/400?random=${item}`}
                      alt={`Work ${item}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-white">visibility</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-purple-400 text-sm mb-1">
                        {item === 1 ? "Web Application" : item === 2 ? "Mobile Design" : item === 3 ? "Visual Identity" : "Web Development"}
                      </p>
                      <h3 className="text-xl font-bold">
                        {item === 1 ? "Lumina Analytics" : item === 2 ? "Zenith Banking" : item === 3 ? "Orbit Brand" : "Velvet Fashion"}
                      </h3>
                    </div>
                    <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform">
                      arrow_outward
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Let build something{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    remarkable
                  </span>{' '}
                  together.
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Currently open to new projects and exciting opportunities. Feel free to reach out
                  via the form or my social channels.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-purple-400">mail</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">asifazhar92@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-purple-400">call</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="font-medium">+91 6207118704</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form with MongoDB */}
              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                {/* Status Message */}
                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success'
                      ? 'bg-green-600/20 border border-green-600 text-green-400'
                      : 'bg-red-600/20 border border-red-600 text-red-400'
                    }`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Type</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600 transition-colors"
                    >
                      <option>UI/UX Design</option>
                      <option>Web Development</option>
                      <option>Branding</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell me about your project..."
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600 transition-colors"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 Asif Raza. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;