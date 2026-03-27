const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '67c216cd3e25091a1a79ef6e' }, process.env.JWT_SECRET || 'super_secret_jwt_key_for_droppay');

async function testVPA() {
    try {
        console.log("Mocking UPI Payload Check...");
        const payload = { 
            type: 'vpa',
            name: 'Rohit UPI',
            vpa: 'success@razorpay',
            otp: '123456' 
        };
        console.log("PAYLOAD: ", payload);
        console.log("Test Script Confirms Syntax.")
    } catch(err) {
        console.error(err);
    }
}
testVPA();
