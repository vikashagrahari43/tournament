import { Suspense } from "react";
import { PaymentScreenshotPage } from "./PaymentScreenshotPage";

export default function ScreenshotPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <PaymentScreenshotPage />
    </Suspense>
  );
}