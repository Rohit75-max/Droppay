const axios = require('axios');

async function test404() {
    try {
        const res = await axios.post('http://localhost:5001/api/payment/verify', {
            razorpay_order_id: "order_test123",
            razorpay_payment_id: "pay_test123",
            razorpay_signature: "invalid_sig", // Should return 400 Invalid Signature if route exists
            streamerId: "rohit",
            donorName: "Tester",
            message: "Test 404 drop",
            sticker: "zap",
            amount: 100
        });
        console.log("Success:", res.data);
    } catch (err) {
        if (err.response) {
            console.error(`ERROR: Status ${err.response.status}`, err.response.data);
        } else {
            console.error("AXIOS ERROR:", err.message);
        }
    }
}

test404();
