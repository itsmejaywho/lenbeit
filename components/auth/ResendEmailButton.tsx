"use client";

import { useEffect, useState } from "react";

export function ResendEmailButton() {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (secondsRemaining === 0) return;
    const timer = window.setTimeout(() => {
      setSecondsRemaining((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [secondsRemaining]);

  function resend() {
    if (secondsRemaining > 0) return;
    // TODO: Call the PHP resend-confirmation endpoint through lib/api once it is available.
    setStatus("Email sent again.");
    setSecondsRemaining(60);
  }

  return (
    <div className="check-email-resend-wrap">
      <button
        className="button button-outline check-email-resend"
        type="button"
        disabled={secondsRemaining > 0}
        onClick={resend}
      >
        {secondsRemaining > 0 ? `Resend in ${secondsRemaining}s` : "Resend email"}
      </button>
      {status && <p className="login-status" role="status" aria-live="polite">{status}</p>}
    </div>
  );
}
