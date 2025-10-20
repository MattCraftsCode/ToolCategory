/**
 * PayPal Configuration Diagnostic Tool
 * Run this script to check if PayPal is properly configured
 */

import { getPayPalAccessToken, createPayPalOrder } from "@/lib/paypal";

async function checkPayPalConfiguration() {
  console.log("🔍 Checking PayPal Configuration...\n");

  // 1. Check environment variables
  console.log("1. Environment Variables:");
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE;

  console.log(`   PAYPAL_CLIENT_ID: ${clientId ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PAYPAL_CLIENT_SECRET: ${clientSecret ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PAYPAL_MODE: ${mode || 'sandbox (default)'}`);

  if (!clientId || !clientSecret) {
    console.log("\n❌ PayPal credentials are missing!");
    console.log("Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.");
    return false;
  }

  // 2. Test PayPal Access Token
  console.log("\n2. Testing PayPal Authentication:");
  try {
    const accessToken = await getPayPalAccessToken();
    console.log(`   ✅ Successfully obtained access token: ${accessToken.substring(0, 20)}...`);
  } catch (error) {
    console.log(`   ❌ Failed to get access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }

  // 3. Test Order Creation
  console.log("\n3. Testing PayPal Order Creation:");
  try {
    const testOrder = await createPayPalOrder({
      amount: "1.00",
      currency: "USD",
      description: "Test order - ToolCategory Basic plan",
      returnUrl: "http://localhost:3000/test-return",
      cancelUrl: "http://localhost:3000/test-cancel",
    });

    console.log(`   ✅ Successfully created test order: ${testOrder.id}`);
    console.log(`   Order status: ${testOrder.status}`);

    const approvalUrl = testOrder.links?.find(link => link.rel === "approve")?.href;
    if (approvalUrl) {
      console.log(`   ✅ Approval URL generated: ${approvalUrl.substring(0, 50)}...`);
    } else {
      console.log("   ⚠️  No approval URL found in response");
    }

  } catch (error) {
    console.log(`   ❌ Failed to create test order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }

  console.log("\n🎉 All PayPal tests passed! Your configuration is working correctly.");
  return true;
}

// Run the diagnostic
export default async function runPayPalDiagnostic() {
  try {
    await checkPayPalConfiguration();
  } catch (error) {
    console.error("❌ Diagnostic failed:", error);
  }
}

if (require.main === module) {
  runPayPalDiagnostic();
}