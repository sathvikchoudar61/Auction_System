import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { IndianRupee } from "lucide-react";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const AddMoney = () => {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Razorpay SDK failed to load");
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay");

      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount }
      );

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Auction Wallet",
        description: "Wallet Recharge",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?._id,
                amount,
              }
            );

            if (verificationResponse.data.success) {
              alert("✅ Payment Successful! Wallet updated.");
              window.location.reload();
            } else {
              alert("❌ Payment verification failed");
            }
          } catch (err) {
            alert("⚠️ Error verifying payment: " + err.message);
          }
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[80%] mx-auto min-h-[75vh] pb-[15vh] mt-24">
      <div className="bg-[#111827] rounded-2xl shadow-2xl p-8 border border-gray-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-6">
          {/* Info Section */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-green-400 mb-2">Recharge Wallet</h2>
            <p className="text-gray-400 text-sm mb-2">
              Add funds securely using Razorpay.
            </p>
            <div className="text-xl font-semibold text-green-400 mt-2">
              Balance: ₹{user?.walletBalance?.toFixed(2) || "0.00"}
            </div>
          </div>

          {/* Input + Button Section */}
          <div className="w-full md:w-1/2 space-y-3">
            <Input
              icon={IndianRupee}
              type="number"
              placeholder="Enter amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2.5 rounded-lg transition duration-300 text-md"
            >
              {loading ? "Processing..." : `Add ₹${amount || "0"} to Wallet`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoney;
