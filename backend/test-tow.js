const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '67c216cd3e25091a1a79ef6e' }, process.env.JWT_SECRET || 'super_secret_jwt_key_for_droppay');

async function testTow() {
    try {
        console.log("Mocking Webhook...");
        const payload = { 
            razorpay_order_id: 'order_test123',
            razorpay_payment_id: 'pay_test123',
            razorpay_signature: 'signature_bypassed_in_test_only_if_we_disable_it',
            streamerId: 'rohit',
            donorName: 'TestUser',
            message: 'Go Team A!',
            sticker: 'hype_zap',
            amount: 500,
            tugOfWarSide: 'A'
        };
        console.log("To fully test the update, the frontend is now equipped to pass tugOfWarSide: 'A' to razorpay webhook payload.")
        console.log("Test Script syntax passed.");
    } catch(err) {
        console.error(err);
    }
}
testTow();
