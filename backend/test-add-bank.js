const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '67c216cd3e25091a1a79ef6e' }, process.env.JWT_SECRET || 'super_secret_jwt_key_for_droppay');
const API_BASE = 'http://localhost:5001';

async function test() {
  try {
    console.log("1. Generating OTP via phone verify block... (Requires backend modification from earlier?)");
    // To properly simulate the real scenario, let's create a User object locally and save OTP, but we can't do that from outside easily unless we use mongoose connect.
    console.log("Testing via backend script...");
  } catch (e) {
    console.error(e.message);
  }
}
test();
