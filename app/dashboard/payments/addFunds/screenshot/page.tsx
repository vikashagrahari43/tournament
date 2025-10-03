"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const PaymentScreenshotPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get payment amount from URL query params
  const amount = searchParams.get("amount");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      alert("Please upload a payment screenshot first");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get ImageKit auth params
      const authRes = await fetch("/api/imagekit-auth");
      const { authenticationparameter, publicKey } = await authRes.json();

      // 2. Upload file to ImageKit
      const formData = new FormData();
      formData.append("file", screenshot);
      formData.append("fileName", `payment-${Date.now()}.png`);
      formData.append("publicKey", publicKey);
      formData.append("signature", authenticationparameter.signature);
      formData.append("expire", authenticationparameter.expire.toString());
      formData.append("token", authenticationparameter.token);

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        { method: "POST", body: formData }
      );

      const uploadData = await uploadRes.json();
      if (!uploadData.url) throw new Error("Image upload failed");

      // 3. Call Wallet API
      const walletRes = await fetch("/api/wallet/addrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          screenshotUrl: uploadData.url,
        }),
      });

      const walletData = await walletRes.json();
      if (!walletRes.ok) throw new Error(walletData.error || "Deposit request failed");

      // 4. Success
      alert(`Payment screenshot submitted successfully! Your deposit of ₹${amount} is being processed.`);
      router.push("/dashboard/payments");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/payments/add-funds");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 sm:p-4 lg:p-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
          <div className="space-y-6">
            {/* Payment Amount */}
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-bold text-green-400 mb-2">
                Payment Amount
              </h2>
              <div className="text-3xl sm:text-4xl font-bold text-white">₹{amount}</div>
            </div>

            {/* Upload Area */}
            <div>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center">
                <input
                  type="file"
                  id="screenshot"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {screenshot ? (
                  <div className="space-y-3">
                    <div className="text-green-400 text-3xl sm:text-4xl">✅</div>
                    <p className="text-green-400 font-bold text-sm sm:text-base">
                      Screenshot Selected!
                    </p>
                    <button
                      onClick={() => setScreenshot(null)}
                      className="text-red-400 hover:text-red-300 text-xs sm:text-sm underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-gray-400 text-3xl sm:text-4xl">📷</div>
                    <p className="text-white font-bold text-sm sm:text-base mb-2">
                      Upload Payment Screenshot
                    </p>
                    <label
                      htmlFor="screenshot"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!screenshot || isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Screenshot"
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium text-sm sm:text-base"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreenshotPage;
