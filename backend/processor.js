const crypto = require('crypto');

module.exports = {
  signPayload: (requestParams, context, ee, next) => {
    // 1. Generate unique request identifiers to bypass Idempotency checks
    const paymentId = `pay_stress_${crypto.randomBytes(4).toString('hex')}`;
    const orderId = `order_stress_${crypto.randomBytes(4).toString('hex')}`;

    // 2. Standard Razorpay signature hashing algorithm node uses
    const body = orderId + "|" + paymentId;
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "BNXsMa2QLCsNibnUFSq4UeqX")
      .update(body)
      .digest("hex");

    // 3. Inject missing payload parameters which verifyPayment demands
    requestParams.json = {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
      streamerId: "stress_user_1", // Targets seeded mock node correctly
      amount: 100000, // ₹1,000.00 in Paise
      donorName: "Artillery_VU",
      message: "Stress verification loop payload"
    };

    return next();
  }
};
