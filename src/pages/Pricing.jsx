import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Check, Zap, Shield, Clock, CreditCard, Headphones, Tag, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import {
  getSubscriptionPlans,
  createRazorpayOrderWithCoupon,
  verifyRazorpayPayment,
  validateCoupon,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../components/ui/PromoBanner";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const { user, updateUser } = useAppContext();
  const navigate = useNavigate();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Load plans from backend
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSubscriptionPlans();
        setPlans(data.plans || []);
      } catch (err) {
        console.error("Failed to load plans:", err);
        toast.error("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    })();
    
    // Check for promo coupon code from banner
    const promoCoupon = sessionStorage.getItem('promoCouponCode');
    if (promoCoupon) {
      setCouponCode(promoCoupon);
      sessionStorage.removeItem('promoCouponCode'); // Clear after use
    }
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Validate coupon
  const handleValidateCoupon = async (planId) => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    setCouponLoading(true);
    try {
      const { data } = await validateCoupon(couponCode.trim(), planId);
      console.log('Coupon validation response:', data);
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        if (data.coupon.applicablePlans && data.coupon.applicablePlans.length > 0) {
          toast.success(`Coupon applied! ${data.coupon.discountPercent}% off on ${data.coupon.applicablePlans.join(', ')} plans`);
        } else {
          toast.success(`Coupon applied! ${data.coupon.discountPercent}% off on all plans`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Handle Purchase Button
  const handlePurchase = async (planId) => {
    try {
      if (!user) {
        toast.error("Please login to purchase a plan");
        navigate("/login");
        return;
      }

      if (planId === "free") {
        return; // Free plan cannot be purchased
      }

      setPurchasing(planId);
      toast.loading("Preparing checkout...", { id: "checkout" });

      // Create Razorpay order with coupon
      const { data } = await createRazorpayOrderWithCoupon(planId, appliedCoupon?.code || null);
      toast.dismiss("checkout");

      // Initialize Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "PlagZap",
        description: `${data.planName} Subscription${data.appliedCoupon ? ` (${data.appliedCoupon.discountPercent}% off)` : ''}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "verify" });
            
            // Verify payment on backend
            const verifyResult = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId,
            });

            toast.dismiss("verify");

            if (verifyResult.data.success) {
              // Update user context
              updateUser({
                ...user,
                subscriptionTier: verifyResult.data.subscription.tier,
                subscriptionExpiry: verifyResult.data.subscription.expiry,
              });
              toast.success("Payment successful! 🎉");
              navigate("/payment-success");
            }
          } catch (error) {
            toast.dismiss("verify");
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: function () {
            setPurchasing(null);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
        setPurchasing(null);
      });
      razorpay.open();
    } catch (error) {
      toast.dismiss("checkout");
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to initiate payment");
      setPurchasing(null);
    }
  };


  // Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Promotional Banner */}
        <PromoBanner showOnPaidUsers={true} />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            Start with free tier or upgrade for unlimited access
          </p>
        </motion.div>

        {/* Coupon Code Section */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-10"
          >
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-400" />
                Have a Coupon Code?
              </h3>
              
              {appliedCoupon ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-bold">{appliedCoupon.code}</p>
                      <p className="text-sm text-gray-400">{appliedCoupon.discountPercent}% discount applied</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-red-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-purple-500 outline-none text-center font-mono"
                  />
                  <button
                    onClick={() => handleValidateCoupon(null)}
                    disabled={couponLoading}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            // Calculate discounted price if coupon is applied AND valid for this plan
            const applicablePlans = appliedCoupon?.applicablePlans || [];
            const isApplicableEmpty = !applicablePlans || applicablePlans.length === 0;
            const isPlanIncluded = applicablePlans.includes(plan.id);
            
            // Debug log
            if (appliedCoupon && plan.id !== 'free') {
              console.log(`Plan: ${plan.id}, ApplicablePlans: [${applicablePlans.join(',')}], IsEmpty: ${isApplicableEmpty}, IsPlanIncluded: ${isPlanIncluded}`);
            }
            
            const isCouponValidForPlan = appliedCoupon && plan.id !== 'free' && (
              // If no specific plans set, apply to all paid plans
              isApplicableEmpty || isPlanIncluded
            );
            const hasDiscount = isCouponValidForPlan;
            const discountedPrice = hasDiscount 
              ? Math.round(plan.price - (plan.price * appliedCoupon.discountPercent / 100))
              : plan.price;
            const savings = hasDiscount ? plan.price - discountedPrice : 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-background/50 backdrop-blur-md border ${
                  plan.id === "annual"
                    ? "border-purple-500/50 scale-105"
                    : hasDiscount && plan.id !== 'free'
                    ? "border-green-500/50"
                    : "border-white/10"
                } rounded-2xl p-8 shadow-2xl transition-all`}
              >
                {plan.id === "annual" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Best Value
                  </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{appliedCoupon.discountPercent}% OFF
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {hasDiscount ? (
                      <>
                        <span className="text-4xl font-bold text-green-400">₹{discountedPrice}</span>
                        <span className="text-xl text-gray-500 line-through">₹{plan.price}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                    )}
                    {plan.id !== "free" && (
                      <span className="text-gray-400">/ {plan.duration}</span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      You save ₹{savings}!
                    </p>
                  )}
                </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={
                  purchasing === plan.id || (user && plan.id === user.subscriptionTier)
                }
                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.id === "free"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                } disabled:opacity-50`}
              >
                {purchasing === plan.id ? (
                  "Processing..."
                ) : user && plan.id === user.subscriptionTier ? (
                  "Current Plan"
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    {plan.id === "free" ? "Get Started" : "Upgrade Now"}
                  </>
                )}
              </button>
            </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: <Shield className="h-6 w-6" />, text: "Secure Payments" },
            { icon: <Clock className="h-6 w-6" />, text: "Instant Access" },
            { icon: <CreditCard className="h-6 w-6" />, text: "Cancel Anytime" },
            { icon: <Headphones className="h-6 w-6" />, text: "24/7 Support" },
          ].map((badge, idx) => (
            <div key={idx} className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-purple-400">{badge.icon}</div>
              <span className="text-gray-300 font-medium">{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8 mb-16"
        >
          <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">7-Day Money-Back Guarantee</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Not satisfied? Get a full refund within 7 days of purchase. No questions asked.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default Pricing;
