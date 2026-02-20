// 1. Select the database
use('test'); 

// 2. Reset your specific account banking and subscription data
db.users.updateOne(
  { streamerId: "imrk14" }, 
  { 
    $set: { 
      razorpayAccountId: null, 
      "payoutSettings.bankDetailsLinked": false,
      "payoutSettings.onboardingStatus": "pending",
      "subscription.status": "inactive"
    } 
  }
);

// 3. Optional: Verify the change
db.users.find({ streamerId: "imrk14" });