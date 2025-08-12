import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      await User.findByIdAndUpdate(userId, { $inc: { walletBalance: parseFloat(amount) } });
      res.json({ success: true });
    } catch (err) {
      console.error("Wallet update error:", err);
      res.status(500).json({ success: false, error: "Failed to update wallet" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};
