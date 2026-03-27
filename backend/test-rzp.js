const Razorpay = require('razorpay');
const rzp = new Razorpay({ key_id: 'rzp_test_SHrX3upgmJ6sGL', key_secret: 'BNXsMa2QLCsNibnUFSq4UeqX' });

async function test() {
  try {
    const account = await rzp.accounts.create({
      email: "test_ob@example.com",
      name: "test user",
      type: "route", 
      reference_id: "test_" + Date.now(),
      legal_business_name: "Test User",
      customer_facing_business_name: `Test User on Drope`,
      profile: { 
          category: "entertainment", 
          subcategory: "video_streaming",
          description: "Digital content creator and streamer services."
      }
    });
    console.log("Account created:", account.id);
    
    // stakeholders link doesn't exist? Account login token exists?
    // Let's try to see if razorpay.stakeholders or something exists.
    // wait, razorpay is just accounts. 
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
