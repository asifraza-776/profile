


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// export default function Home() {
//   const { data: session, status } = useSession();

//   return (
//     <>
//       <div className="flex justify-center flex-col gap-4 items-center text-white h-[44vh] px-5 md:px-0 text-xs md:text-base  ">
//         <div className="font-bold flex gap-2 text-5xl justify-center items-center">
//           Asif Profile
//           <span>
//             <img className="invertImg" src="/tea.gif" width={88} alt="" />
//           </span>
//         </div>
//         <p className="text-center md:text-left">
//           A crowdfunding platform for creators to fund their projects.
//         </p>
//         <p className="text-center md:text-left">
//           A place where your fans can see your project. Unleash the power of your fans and get your funds.
//         </p>
//         <div>
//           {/* Conditional button based on session status */}
//           {status === "loading" ? (
//             <button 
//               type="button" 
//               className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 opacity-50 cursor-not-allowed"
//               disabled
//             >
//               Loading...
//             </button>
//           ) : session ? (
//             <Link href="/profile">
//               <button 
//                 type="button" 
//                 className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//               >
//                 Go to Profile
//               </button>
//             </Link>
//           ) : (
//             <Link href="/login">
//               <button 
//                 type="button" 
//                 className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//               >
//                 Start Here
//               </button>
//             </Link>
//           )}

//           <Link href="/about">
//             <button 
//               type="button" 
//               className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//             >
//               Read More
//             </button>
//           </Link>
//         </div>
//       </div>
      
//       <div className="bg-white h-1 opacity-10"></div>

//       <div className="text-white container mx-auto pb-32 pt-14 px-10">
//         <h2 className="text-3xl font-bold text-center mb-14">Your Fans can donate to your projects</h2>
//         <div className="flex gap-5 justify-around flex-wrap">
//           <div className="item space-y-3 flex flex-col items-center justify-center max-w-xs">
//             <img className="bg-slate-400 rounded-full p-2 text-black" width={88} src="/man.gif" alt="" />
//             <p className="font-bold text-center">Fans want to help</p>
//             <p className="text-center">Your fans are available to support you</p>
//           </div>
//           <div className="item space-y-3 flex flex-col items-center justify-center max-w-xs">
//             <img className="bg-slate-400 rounded-full p-2 text-black" width={88} src="/coin.gif" alt="" />
//             <p className="font-bold text-center">Fans want to contribute</p>
//             <p className="text-center">Your fans are willing to contribute financially</p>
//           </div>
//           <div className="item space-y-3 flex flex-col items-center justify-center max-w-xs">
//             <img className="bg-slate-400 rounded-full p-2 text-black" width={88} src="/group.gif" alt="" />
//             <p className="font-bold text-center">Fans want to collaborate</p>
//             <p className="text-center">Your fans are ready to collaborate with you</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white h-1 opacity-10"></div>

//       <div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
//         <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
//         {/* Responsive youtube embed */}
//         <div className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh]">
//           <iframe
//             className="w-full h-full"
//             src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           ></iframe>
//         </div>
//       </div>
//     </>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Install: npm install framer-motion

export default function Home() {
  const { data: session, status } = useSession();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: 1 - scrollY * 0.003
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <img 
                src="/tea.gif" 
                alt="Chai" 
                className="relative w-32 h-32 md:w-40 md:h-40 object-contain animate-float"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            Asif Profile
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            A crowdfunding platform for creators to fund their projects. 
            Where your fans can buy you a chai and support your journey.
          </motion.p>

          {/* Stats */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { number: "500+", label: "Creators" },
              { number: "10K+", label: "Supporters" },
              { number: "₹50L+", label: "Funds Raised" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-purple-400">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {status === "loading" ? (
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg opacity-50 cursor-not-allowed">
                Loading...
              </button>
            ) : session ? (
              <Link href="/profile">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                  <span className="relative z-10">Go to Profile</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                  <span className="relative z-10">Start Here</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </Link>
            )}
            
            <Link href="/about">
              <button className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full font-semibold text-lg hover:bg-purple-500/10 transition-all transform hover:scale-105">
                Read More
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Your Fans Can{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Donate
            </span>{' '}
            to Your Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "/man.gif",
                title: "Fans want to help",
                description: "Your fans are available to support you",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "/coin.gif",
                title: "Fans want to contribute",
                description: "Your fans are willing to contribute financially",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "/group.gif",
                title: "Fans want to collaborate",
                description: "Your fans are ready to collaborate with you",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-purple-500 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                      <img src={feature.icon} alt={feature.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Learn More{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              About Us
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20"></div>
            <iframe
              className="w-full aspect-video relative z-10"
              src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-12 border border-purple-500/30 backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Journey?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are already funding their projects with fan support.
            </p>
            {!session && (
              <Link href="/login">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                  Get Started Now
                </button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}