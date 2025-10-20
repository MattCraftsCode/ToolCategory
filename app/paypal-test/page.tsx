"use client";

import { useState } from "react";

type DiagnosticResult = {
  environment: Record<string, string>;
  paypal: Record<string, string>;
  database: Record<string, string>;
  app: Record<string, string>;
  timestamp: string;
};

export default function PayPalTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);
  const [result, setResult] = useState<string>("");
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);

  const loadDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const response = await fetch("/api/paypal-diagnostics");
      if (response.ok) {
        const data = await response.json();
        setDiagnostics(data);
      } else {
        setResult("❌ Failed to load diagnostics. Make sure you're logged in.");
      }
    } catch (error) {
      setResult(`❌ Failed to load diagnostics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  const testPayPalConfig = async () => {
    setIsLoading(true);
    setResult("Testing PayPal configuration...");

    try {
      // Test creating a minimal PayPal order
      const response = await fetch("/api/payments/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "basic" }),
      });

      const data = await response.json();

      if (response.ok && data.approvalUrl) {
        setResult(`✅ PayPal configuration is working!\n\n🎉 Test order created successfully!\nApproval URL: ${data.approvalUrl.substring(0, 100)}...\n\n⚠️ Note: This is a test order. Do not complete the payment.`);
      } else {
        setResult(`❌ PayPal test failed:\n\nError: ${data.error || 'Unknown error'}\nStatus: ${response.status}\n\nPlease check the console for more details.`);
      }
    } catch (error) {
      setResult(`❌ Request failed:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-[24px] border border-[#f0efef] bg-white p-8 shadow-[0_26px_50px_-40px_rgba(23,23,31,0.35)]">
        <h1 className="mb-6 text-2xl font-bold text-[#1f1f24]">PayPal Configuration Test</h1>

        <div className="mb-6 space-y-3">
          <p className="text-[#5a5a63]">
            This page helps diagnose PayPal payment issues. Use the tools below to test your PayPal configuration.
          </p>
          <div className="rounded-lg bg-[#f3f8ff] p-4 text-sm text-[#4b5b7a]">
            <strong>Required Environment Variables:</strong>
            <ul className="mt-2 space-y-1">
              <li>• PAYPAL_CLIENT_ID</li>
              <li>• PAYPAL_CLIENT_SECRET</li>
              <li>• PAYPAL_MODE (sandbox or live)</li>
              <li>• DATABASE_URL</li>
            </ul>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={loadDiagnostics}
            disabled={isLoadingDiagnostics}
            className="rounded-[16px] border border-[#e4e5ec] bg-white px-6 py-3 font-semibold text-[#1f1f24] transition hover:bg-[#f7f7fb] disabled:opacity-50"
          >
            {isLoadingDiagnostics ? "Loading..." : "Check Configuration"}
          </button>

          <button
            onClick={testPayPalConfig}
            disabled={isLoading}
            className="rounded-[16px] bg-[#ff6d57] px-6 py-3 font-semibold text-white transition hover:bg-[#ff5a43] disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Test PayPal Order Creation"}
          </button>
        </div>

        {diagnostics && (
          <div className="mb-6 rounded-lg bg-[#f7f7fb] p-4">
            <h3 className="mb-4 font-semibold text-[#1f1f24]">Configuration Status:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-[#1f1f24]">PayPal Configuration:</h4>
                <ul className="space-y-1 text-sm">
                  {Object.entries(diagnostics.paypal).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className={value.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-[#1f1f24]">Environment:</h4>
                <ul className="space-y-1 text-sm">
                  {Object.entries(diagnostics.environment).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-[#1f1f24]">Database:</h4>
                <ul className="space-y-1 text-sm">
                  {Object.entries(diagnostics.database).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className={value.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-[#1f1f24]">App URLs:</h4>
                <ul className="space-y-1 text-sm">
                  {Object.entries(diagnostics.app).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="truncate">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mb-6 rounded-lg bg-[#f7f7fb] p-4">
            <h3 className="mb-2 font-semibold text-[#1f1f24]">Test Result:</h3>
            <pre className="whitespace-pre-wrap text-sm text-[#5a5a63]">{result}</pre>
          </div>
        )}

        <div className="space-y-6 text-sm text-[#5a5a63]">
          <div>
            <h3 className="mb-3 font-semibold text-[#1f1f24]">Common Issues & Solutions:</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-[#ffd7d7] bg-[#fff2f2] p-4">
                <h4 className="font-medium text-[#8a3030]">❌ Missing PayPal Credentials</h4>
                <p className="mt-1">
                  Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your .env file.
                  Get these from your PayPal Developer Dashboard.
                </p>
              </div>

              <div className="rounded-lg border border-[#ffd7d7] bg-[#fff2f2] p-4">
                <h4 className="font-medium text-[#8a3030]">❌ PayPal Authentication Failed</h4>
                <p className="mt-1">
                  Your PayPal credentials might be incorrect or expired.
                  Verify them in your PayPal Developer Dashboard.
                </p>
              </div>

              <div className="rounded-lg border border-[#ffd7d7] bg-[#fff2f2] p-4">
                <h4 className="font-medium text-[#8a3030]">❌ Database Error</h4>
                <p className="mt-1">
                  Make sure your DATABASE_URL is set and the database is accessible.
                  Run database migrations if needed.
                </p>
              </div>

              <div className="rounded-lg border border-[#cceede] bg-[#f3fff8] p-4">
                <h4 className="font-medium text-[#2e6a4a]">✅ How to Set Up PayPal</h4>
                <ol className="mt-1 list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://developer.paypal.com" className="text-[#ff6d57] hover:underline" target="_blank" rel="noopener">PayPal Developer Dashboard</a></li>
                  <li>Create a new app or use an existing one</li>
                  <li>Copy the Client ID and Client Secret</li>
                  <li>Add them to your .env file</li>
                  <li>Set PAYPAL_MODE=sandbox for testing</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}