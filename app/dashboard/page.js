// "use client";

// import React, { useState, useEffect } from 'react';
// import { useSession } from "next-auth/react";
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { toast } from 'react-toastify';

// const DashboardPage = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('settings'); // Default to settings for setup
//   const [formData, setFormData] = useState({
//     username: '',
//     bio: '',
//     razorpayid: '',
//     razorpaysecret: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalViews: 0,
//     totalSupporters: 0,
//     totalEarnings: 0,
//     pendingRequests: 0
//   });

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push('/login');
//     } else if (session?.user) {
//       fetchUserData();
//     }
//   }, [status, router, session]);

//   const fetchUserData = async () => {
//     try {
//       const res = await fetch(`/api/user?email=${session.user.email}`);
//       const data = await res.json();
//       if (data.success) {
//         setFormData({
//           username: data.user.username || '',
//           bio: data.user.bio || '',
//           razorpayid: data.user.razorpayid || '',
//           razorpaysecret: '' // Don't populate secret
//         });
        
//         // Update stats with real data
//         setStats({
//           totalViews: data.user.views || 12453,
//           totalSupporters: data.payments?.length || 0,
//           totalEarnings: data.payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
//           pendingRequests: 0
//         });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.razorpayid || !formData.razorpaysecret) {
//       toast.error("Please enter both Razorpay Key ID and Secret");
//       return;
//     }

//     try {
//       const res = await fetch('/api/user/update', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: session.user.email,
//           username: formData.username,
//           bio: formData.bio,
//           razorpayid: formData.razorpayid,
//           razorpaysecret: formData.razorpaysecret
//         })
//       });

//       const data = await res.json();
      
//       if (data.success) {
//         toast.success('✅ Payment settings saved successfully!');
//         setFormData(prev => ({ ...prev, razorpaysecret: '' }));
//       } else {
//         toast.error(data.error || 'Failed to save');
//       }
//     } catch (error) {
//       toast.error('Error saving settings');
//     }
//   };

//   if (status === "loading" || loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-400">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Header */}
//       <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-0 backdrop-blur-md">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                 Dashboard
//               </Link>
//               <span className="text-sm text-gray-500 hidden md:inline">|</span>
//               <span className="text-sm text-gray-400 hidden md:inline">Welcome back, {session.user?.name || 'User'}</span>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Link href={`/payments`} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
//                 View Payment Page
//               </Link>
//               <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
//                 Home
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-8">
//         {/* Tabs */}
//         <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4 overflow-x-auto">
//           {['overview', 'settings'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
//                 activeTab === tab 
//                   ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
//                   : 'text-gray-400 hover:text-white hover:bg-gray-800'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Overview Tab */}
//         {activeTab === 'overview' && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
//                 <p className="text-gray-400 text-sm mb-2">Total Supporters</p>
//                 <p className="text-3xl font-bold">{stats.totalSupporters}</p>
//               </div>
              
//               <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
//                 <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
//                 <p className="text-3xl font-bold">₹{stats.totalEarnings}</p>
//               </div>
              
//               <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
//                 <p className="text-gray-400 text-sm mb-2">Payment Status</p>
//                 <p className={`text-lg font-bold ${formData.razorpayid ? 'text-green-400' : 'text-yellow-400'}`}>
//                   {formData.razorpayid ? '✅ Configured' : '⚠️ Not Configured'}
//                 </p>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Settings Tab */}
//         {activeTab === 'settings' && (
//           <div className="max-w-2xl mx-auto">
//             <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
//               <h3 className="text-xl font-bold mb-6">Payment Settings</h3>
              
//               <div className={`mb-6 p-4 rounded-lg ${
//                 formData.razorpayid 
//                   ? 'bg-green-600/20 border border-green-600' 
//                   : 'bg-yellow-600/20 border border-yellow-600'
//               }`}>
//                 <p className={formData.razorpayid ? 'text-green-400' : 'text-yellow-400'}>
//                   <strong>{formData.razorpayid ? '✅ Live Mode Active' : '⚠️ Setup Required'}</strong><br />
//                   {formData.razorpayid 
//                     ? 'Your payment system is ready to accept donations!' 
//                     : 'Enter your Razorpay live credentials below to start accepting payments'}
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-2">Username</label>
//                   <input 
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     placeholder="your-username"
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
//                     required
//                   />
//                   <p className="text-xs text-gray-500 mt-1">This will be your public username</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-400 mb-2">Bio</label>
//                   <textarea 
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleChange}
//                     rows="2"
//                     placeholder="Tell your story..."
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-400 mb-2">Razorpay Key ID (Live)</label>
//                   <input 
//                     type="text"
//                     name="razorpayid"
//                     value={formData.razorpayid}
//                     onChange={handleChange}
//                     placeholder="rzp_live_..."
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-400 mb-2">Razorpay Key Secret (Live)</label>
//                   <input 
//                     type="password"
//                     name="razorpaysecret"
//                     value={formData.razorpaysecret}
//                     onChange={handleChange}
//                     placeholder="Enter your live secret key"
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
//                     required
//                   />
//                 </div>

//                 <button 
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium transition-all"
//                 >
//                   Save Payment Settings
//                 </button>
//               </form>

//               {formData.razorpayid && (
//                 <div className="mt-6 p-4 bg-blue-600/20 rounded-lg">
//                   <p className="text-blue-400 text-sm">
//                     ✅ Your payment page is live at:{' '}
//                     <Link href={`/payments`} className="underline hover:text-blue-300">
//                       /payments
//                     </Link>
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;


// previouse daseboard working code 


"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    razorpayid: '',
    razorpaysecret: ''
  });

  // Sample data for recent activity
  const recentActivity = [
    { id: 1, user: "John Doe", action: "supported your page", amount: "$5", time: "2 min ago" },
    { id: 2, user: "Jane Smith", action: "left a comment", comment: "Great work!", time: "15 min ago" },
    { id: 3, user: "Mike Johnson", action: "became a supporter", amount: "$10", time: "1 hour ago" },
    { id: 4, user: "Sarah Williams", action: "shared your page", time: "3 hours ago" },
    { id: 5, user: "Alex Brown", action: "supported your page", amount: "$3", time: "5 hours ago" },
  ];

  // Fetch user data and payments
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (session?.user) {
      fetchUserData();
      fetchPayments();
    }
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/user?email=${session.user.email}`);
      const data = await res.json();
      if (data.success) {
        setFormData({
          username: data.user.username || '',
          bio: data.user.bio || '',
          razorpayid: data.user.razorpayid || '',
          razorpaysecret: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/user?email=${session.user.email}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.razorpayid || !formData.razorpaysecret) {
      toast.error("Please enter both Razorpay Key ID and Secret");
      return;
    }

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          username: formData.username,
          bio: formData.bio,
          razorpayid: formData.razorpayid,
          razorpaysecret: formData.razorpaysecret
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('✅ Payment settings saved successfully!');
        setFormData(prev => ({ ...prev, razorpaysecret: '' }));
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (error) {
      toast.error('Error saving settings');
    }
  };

  // Show loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Calculate stats from real payments data
  const totalSupporters = payments.length;
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonthSupporters = payments.filter(p => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    return new Date(p.createdAt) > thisMonth;
  }).length;
  const thisMonthEarnings = payments.reduce((sum, p) => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    return new Date(p.createdAt) > thisMonth ? sum + p.amount : sum;
  }, 0);
  const thisWeekSupporters = payments.filter(p => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return new Date(p.createdAt) > lastWeek;
  }).length;
  const thisWeekEarnings = payments.reduce((sum, p) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return new Date(p.createdAt) > lastWeek ? sum + p.amount : sum;
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-0 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </Link>
              <span className="text-sm text-gray-500 hidden md:inline">|</span>
              <span className="text-sm text-gray-400 hidden md:inline">Welcome back, {session.user?.name || 'User'}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/payments" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                View Payment Page
              </Link>
              <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4 overflow-x-auto">
          {['overview', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Header with Date */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
                <p className="text-gray-400 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export Report
                </button>
                <button 
                  onClick={fetchPayments}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Supporters Card */}
              <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-purple-800/50 hover:border-purple-600 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-all">
                    <span className="material-symbols-outlined text-purple-400 text-2xl">groups</span>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                    +{thisWeekSupporters} this week
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Supporters</p>
                <p className="text-4xl font-bold mb-2">{totalSupporters}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">↑ {thisMonthSupporters}</span>
                  <span className="text-gray-500">this month</span>
                </div>
                <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${Math.min((totalSupporters / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Earnings Card */}
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-xl border border-green-800/50 hover:border-green-600 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-all">
                    <span className="material-symbols-outlined text-green-400 text-2xl">payments</span>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                    +₹{thisWeekEarnings} this week
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                <p className="text-4xl font-bold mb-2">₹{totalEarnings}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">↑ ₹{thisMonthEarnings}</span>
                  <span className="text-gray-500">this month</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min((totalEarnings / 10000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">Goal: ₹10,000</span>
                </div>
              </div>

              {/* Payment Status Card */}
              <div className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 p-6 rounded-xl border border-orange-800/50 hover:border-orange-600 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-600/20 rounded-lg group-hover:bg-orange-600/30 transition-all">
                    <span className="material-symbols-outlined text-orange-400 text-2xl">account_balance</span>
                  </div>
                  {formData.razorpayid && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Active</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-1">Payment Status</p>
                <div className="flex items-center gap-3 mb-2">
                  <p className={`text-2xl font-bold ${formData.razorpayid ? 'text-green-400' : 'text-yellow-400'}`}>
                    {formData.razorpayid ? 'Live Mode' : 'Setup Required'}
                  </p>
                </div>
                {formData.razorpayid ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">Razorpay Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">Payments Enabled</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-400">⚠️</span>
                      <span className="text-gray-300">Complete setup to accept payments</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      Go to Settings
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Average Contribution Card */}
              <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl border border-blue-800/50 hover:border-blue-600 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-all">
                    <span className="material-symbols-outlined text-blue-400 text-2xl">trending_up</span>
                  </div>
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">Avg</span>
                </div>
                <p className="text-gray-400 text-sm mb-1">Average Contribution</p>
                <p className="text-4xl font-bold mb-2">
                  ₹{totalSupporters > 0 ? (totalEarnings / totalSupporters).toFixed(0) : 0}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400">↗️ +5.3%</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </div>
            </div>

            {/* Charts and Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Earnings Chart */}
              <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Earnings Overview</h3>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                
                {/* Chart Bars */}
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full">
                        <div 
                          className="h-0 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg transition-all group-hover:from-purple-500 group-hover:to-blue-500"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₹{(height * 15).toFixed(0)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Supporters Preview */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Recent Supporters</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {payments && payments.length > 0 ? (
                    payments.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {p.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate">{p.message || 'No message'}</p>
                        </div>
                        <div className="text-green-400 font-bold text-sm">₹{p.amount}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No supporters yet. Be the first! 🎉</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('supporters')}
                  className="mt-4 text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 w-full"
                >
                  View All Supporters
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-all">
                    <span className="material-symbols-outlined text-purple-400 mb-2">share</span>
                    <p className="font-medium">Share Page</p>
                    <p className="text-xs text-gray-400">Get more supporters</p>
                  </button>
                  <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-all">
                    <span className="material-symbols-outlined text-green-400 mb-2">campaign</span>
                    <p className="font-medium">Promote</p>
                    <p className="text-xs text-gray-400">Boost your reach</p>
                  </button>
                  <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-all">
                    <span className="material-symbols-outlined text-blue-400 mb-2">analytics</span>
                    <p className="font-medium">Analytics</p>
                    <p className="text-xs text-gray-400">View detailed stats</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-all"
                  >
                    <span className="material-symbols-outlined text-yellow-400 mb-2">settings</span>
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-gray-400">Configure payments</p>
                  </button>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Achievements</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-yellow-400">emoji_events</span>
                    <p className="text-xs font-medium mt-1">First Support</p>
                    {totalSupporters > 0 ? (
                      <span className="text-xs text-green-400">✓ Earned</span>
                    ) : (
                      <span className="text-xs text-gray-500">Locked</span>
                    )}
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-purple-400">military_tech</span>
                    <p className="text-xs font-medium mt-1">10 Supporters</p>
                    {totalSupporters >= 10 ? (
                      <span className="text-xs text-green-400">✓ Earned</span>
                    ) : (
                      <span className="text-xs text-gray-500">{10 - totalSupporters} more</span>
                    )}
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-blue-400">workspace_premium</span>
                    <p className="text-xs font-medium mt-1">₹1000 Earned</p>
                    {totalEarnings >= 1000 ? (
                      <span className="text-xs text-green-400">✓ Earned</span>
                    ) : (
                      <span className="text-xs text-gray-500">₹{1000 - totalEarnings} left</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-2 h-2 mt-2 bg-purple-400 rounded-full"></div>
                      {i < recentActivity.length - 1 && (
                        <div className="absolute top-4 left-1 w-0.5 h-12 bg-gray-700"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.user}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {activity.action} {activity.amount && <span className="text-green-400">{activity.amount}</span>}
                        {activity.comment && `: "${activity.comment}"`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-6">Payment Settings</h3>
              
              <div className={`mb-6 p-4 rounded-lg ${
                formData.razorpayid 
                  ? 'bg-green-600/20 border border-green-600' 
                  : 'bg-yellow-600/20 border border-yellow-600'
              }`}>
                <p className={formData.razorpayid ? 'text-green-400' : 'text-yellow-400'}>
                  <strong>{formData.razorpayid ? '✅ Live Mode Active' : '⚠️ Setup Required'}</strong><br />
                  {formData.razorpayid 
                    ? 'Your payment system is ready to accept donations!' 
                    : 'Enter your Razorpay live credentials below to start accepting payments'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Username</label>
                  <input 
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="your-username"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be your public username</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Tell your story..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Razorpay Key ID (Live)</label>
                  <input 
                    type="text"
                    name="razorpayid"
                    value={formData.razorpayid}
                    onChange={handleChange}
                    placeholder="rzp_live_..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Razorpay Key Secret (Live)</label>
                  <input 
                    type="password"
                    name="razorpaysecret"
                    value={formData.razorpaysecret}
                    onChange={handleChange}
                    placeholder="Enter your live secret key"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium transition-all"
                >
                  Save Payment Settings
                </button>
              </form>

              {formData.razorpayid && (
                <div className="mt-6 p-4 bg-blue-600/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    ✅ Your payment page is live at:{' '}
                    <Link href="/payments" className="underline hover:text-blue-300">
                      /payments
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;