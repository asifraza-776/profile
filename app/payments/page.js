

"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Bounce } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import 'react-toastify/dist/ReactToastify.css';

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentform, setPaymentForm] = useState({
    name: '',
    message: '',
    amount: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId] = useState('asifazhar92@oksbi'); // Your UPI ID

  // Fetch user data
  useEffect(() => {
    if (session?.user) {
      fetchUserData();
      setPaymentForm(prev => ({ ...prev, name: session.user.name || '' }));
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/user?email=${session.user.email}`);
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPaymentForm({ ...paymentform, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payWithRazorpay = async (amount) => {
    if (!currentUser?.razorpayid) {
      toast.error("Payment not configured! Please set up in dashboard.");
      return;
    }

    if (!paymentform.name) {
      toast.error("Please enter your name");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway');
      return;
    }

    try {
      console.log('🔵 Creating order for amount:', amount);
      const orderRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          to_user: currentUser.username,
          name: paymentform.name,
          message: paymentform.message
        })
      });

      const order = await orderRes.json();
      console.log('✅ Order created:', order);

      if (!order.success) {
        toast.error(order.error);
        return;
      }

      const options = {
        key: currentUser.razorpayid,
        amount: order.order.amount,
        currency: 'INR',
        name: `Support @${currentUser.username}`,
        description: 'Get Me a Chai Donation',
        image: currentUser.profilepic || '/default-avatar.png',
        order_id: order.order.id,
        
        handler: async (response) => {
          console.log('✅ Razorpay payment success:', response);

          toast.info('Verifying payment...', { autoClose: false, toastId: 'verifying' });

          const verifyData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            oid: order.order.id
          };
          console.log('🔵 Sending to verify API:', verifyData);

          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyData)
            });

            const verifyResult = await verifyRes.json();
            console.log('✅ Verification API response:', verifyResult);

            toast.dismiss('verifying');

            if (verifyResult.success) {
              toast.success('🎉 Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });

              console.log('🔵 Refreshing user data...');
              await fetchUserData();

              setPaymentForm({
                name: session?.user?.name || '',
                message: '',
                amount: ''
              });
              setShowQR(false);

              console.log('✅ Payment flow complete');
            } else {
              console.error('❌ Verification failed:', verifyResult);
              toast.error(verifyResult.error || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error('❌ Verification request error:', verifyError);
            toast.dismiss('verifying');
            toast.error('Verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            console.log('🔴 Razorpay modal closed');
            toast.dismiss('verifying');
          }
        },
        prefill: {
          name: paymentform.name,
          email: session?.user?.email || '',
        },
        theme: {
          color: '#8B5CF6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('❌ Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const handlePay = () => {
    const amount = parseInt(paymentform.amount);
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount (minimum ₹1)");
      return;
    }

    if (!paymentform.name) {
      toast.error("Please enter your name");
      return;
    }

    if (paymentMethod === 'razorpay') {
      payWithRazorpay(amount * 100);
    } else {
      setShowQR(true);
      setShowUpiForm(false);
    }
  };

  const generateUPIPayment = () => {
    const amount = parseInt(paymentform.amount);
    const name = encodeURIComponent(paymentform.name || 'Supporter');
    const message = encodeURIComponent(paymentform.message || 'Support');
    
    return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${message}`;
  };

  const copyUPILink = () => {
    const upiLink = generateUPIPayment();
    navigator.clipboard.writeText(upiLink);
    toast.success('✅ UPI link copied!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    toast.success(`✅ UPI ID ${upiId} copied!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const handleUpiVerification = async () => {
    if (!transactionId) {
      toast.error('Please enter transaction ID');
      return;
    }

    try {
      const res = await fetch('/api/upi-payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: paymentform.name,
          amount: parseInt(paymentform.amount),
          message: paymentform.message,
          transactionId,
          to_user: currentUser?.username || 'asifazhar786'
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success('🎉 Payment verified! Thank you for your support!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        
        // Refresh data
        await fetchUserData();
        
        // Reset all states
        setShowUpiForm(false);
        setShowQR(false);
        setTransactionId('');
        setPaymentForm({
          name: session?.user?.name || '',
          message: '',
          amount: ''
        });
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('UPI verification error:', error);
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleQuickPay = (amt) => {
    setPaymentForm({ ...paymentform, amount: amt.toString() });
    if (paymentMethod === 'razorpay') {
      payWithRazorpay(amt * 100);
    } else {
      setShowQR(true);
      setShowUpiForm(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-0 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Asif Raza Ansari
            </Link>
            <div className="flex gap-3">
              <Link href="/dashboard" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                Home
              </Link>
              
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* User Info */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Support <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {currentUser?.username || 'Creator'}
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              {currentUser?.bio || 'Help support this creator get a chai!'}
            </p>
            <div className="text-purple-400 mt-4 text-xl">
              {payments.length} donations • ₹{payments.reduce((a, b) => a + (b.amount || 0), 0)} raised
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Supporters List */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Recent Supporters</h2>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No donations yet. Be the first! 🎉</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {payments.slice(0, 10).map((p, i) => (
                    <div key={i} className="flex items-center gap-3 border-b border-gray-800 pb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-bold">
                        {p.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{p.name}</p>
                        {p.message && <p className="text-sm text-gray-400">"{p.message}"</p>}
                        {p.method === 'upi' && (
                          <span className="text-xs text-green-400">✅ UPI Payment</span>
                        )}
                      </div>
                      <div className="text-green-400 font-bold">₹{p.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>

              {/* Payment Method Selection */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => {
                    setPaymentMethod('razorpay');
                    setShowQR(false);
                    setShowUpiForm(false);
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  💳 Razorpay
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('qr');
                    setShowQR(false);
                    setShowUpiForm(false);
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    paymentMethod === 'qr'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  📱 UPI/QR Code
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={paymentform.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message (Optional)</label>
                  <input
                    type="text"
                    name="message"
                    value={paymentform.message}
                    onChange={handleChange}
                    placeholder="Leave a message"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    value={paymentform.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                {/* QR Code Display with UPI Integration */}
                {showQR && paymentMethod === 'qr' && paymentform.amount && (
                  <div className="mt-4 p-6 bg-white rounded-xl flex flex-col items-center">
                    <h3 className="text-black font-bold mb-4">Pay ₹{paymentform.amount} via UPI</h3>
                    
                    {/* UPI ID Display */}
                    <div className="bg-gray-100 p-3 rounded-lg mb-4 w-full text-center">
                      <p className="text-black text-sm mb-1">UPI ID:</p>
                      <p className="text-black font-mono font-bold text-lg">{upiId}</p>
                    </div>

                    {/* QR Code */}
                    <QRCodeCanvas
                      value={generateUPIPayment()}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="L"
                      includeMargin={false}
                    />
                    
                    <p className="text-black text-sm mt-4 text-center">
                      Scan with any UPI app (Google Pay, PhonePe, Paytm)
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 w-full">
                      <button
                        onClick={copyUPILink}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">link</span>
                        Copy Link
                      </button>
                      <button
                        onClick={copyUPIId}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copy UPI ID
                      </button>
                    </div>

                    {/* Payment Verification Section */}
                    {!showUpiForm ? (
                      <button
                        onClick={() => setShowUpiForm(true)}
                        className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg text-sm hover:bg-green-700 font-medium"
                      >
                        I've Completed the Payment ✓
                      </button>
                    ) : (
                      <div className="mt-4 w-full space-y-3">
                        <p className="text-black text-sm font-medium">Verify Your Payment</p>
                        <input
                          type="text"
                          placeholder="Enter UPI Transaction ID (e.g., UPI123456789)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg text-black"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpiVerification}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => setShowUpiForm(false)}
                            className="flex-1 bg-gray-400 text-black py-2 rounded-lg hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={!paymentform.amount || !paymentform.name}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {paymentMethod === 'razorpay'
                    ? `Pay ₹${paymentform.amount || 0}`
                    : showQR
                      ? 'Change Amount'
                      : `Generate QR for ₹${paymentform.amount || 0}`}
                </button>

                {!currentUser?.razorpayid && paymentMethod === 'razorpay' && (
                  <div className="text-yellow-400 text-sm text-center mt-2 bg-yellow-400/10 p-3 rounded-lg">
                    ⚠️ Card payments not configured. Use QR code or set up in{' '}
                    <Link href="/dashboard" className="underline hover:text-yellow-300">
                      Dashboard
                    </Link>
                  </div>
                )}

                {paymentMethod === 'qr' && (
                  <div className="text-blue-400 text-sm text-center mt-2 bg-blue-400/10 p-3 rounded-lg">
                    💡 UPI ID: <span className="font-mono">{upiId}</span> (SBI)
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <button
                    onClick={() => handleQuickPay(10)}
                    className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    ₹10
                  </button>
                  <button
                    onClick={() => handleQuickPay(20)}
                    className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    ₹20
                  </button>
                  <button
                    onClick={() => handleQuickPay(50)}
                    className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    ₹50
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}