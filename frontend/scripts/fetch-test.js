const axios = require('axios');
const jwtDecode = require('jwt-decode');
const fs = require('fs');
async function test() {
  try {
    const rawTokens = fs.readFileSync('/Users/rohit/Droppay/frontend/src/utils/dummy.txt', 'utf8').catch(()=>null);
    // Let's just write a direct mongoose script instead of hitting the API without the local token
  } catch(e) {}
}
