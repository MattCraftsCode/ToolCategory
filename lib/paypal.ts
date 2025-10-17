import { cache } from "react";

const PROD_BASE_URL = "https://api-m.paypal.com";
const SANDBOX_BASE_URL = "https://api-m.sandbox.paypal.com";

function getMode(): "sandbox" | "live" {
  const mode = process.env.PAYPAL_MODE?.toLowerCase();
  if (mode === "live" || mode === "sandbox") {
    return mode;
  }
  return process.env.NODE_ENV === "production" ? "live" : "sandbox";
}

function getApiBaseUrl() {
  if (process.env.PAYPAL_API_BASE) {
    return process.env.PAYPAL_API_BASE;
  }
  return getMode() === "live" ? PROD_BASE_URL : SANDBOX_BASE_URL;
}

const getCredentials = cache(() => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }

  return { clientId, clientSecret };
});

export async function getPayPalAccessToken(): Promise<string> {
  const { clientId, clientSecret } = getCredentials();
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed with status ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("PayPal auth response missing access_token");
  }

  return data.access_token;
}

export type PayPalOrderParams = {
  amount: string;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
};

export async function createPayPalOrder(params: PayPalOrderParams) {
  const accessToken = await getPayPalAccessToken();
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: params.description,
          amount: {
            currency_code: params.currency,
            value: params.amount,
          },
        },
      ],
      application_context: {
        brand_name: "ToolCategory",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal order creation failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as {
    id: string;
    status?: string;
    links?: Array<{ rel: string; href: string }>;
  };
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal capture failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as {
    id: string;
    status?: string;
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{
          id: string;
          status?: string;
        }>;
      };
    }>;
  };
}
