// src/app/pages/reset-password/index.js

import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import ReactGA from "react-ga";
ReactGA.pageview("reset-password");

function ResetPasswordPage() {
  ReactGA.pageview("ResetPasswordPage");
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    ReactGA.event("event", {
      category: "reset-password",
      action: "click",
      label: "handleSubmit",
    });

    setLoading(true);

    const response = await fetch('http://localhost:8000/dj-rest-auth/password/reset/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.ok) {
      setLoading(false);
      setShowSuccessModal(true);
      console.log('Password reset link sent successfully');
    } else {
      setLoading(false);
      console.error('Failed to send password reset link');
    }
  };

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading}>Sending Reset Link...</div>}
      {showSuccessModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Success</h3>
            <p>Password reset link has been sent to your email.</p>
            <button onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className={styles.title}>
            <b>Flower Marketplace</b>
          </h2>

          <div className={styles.inputField}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={handleSubmit}>
              Reset Password
            </button>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-4">
            <button className={`btn ${styles.btnSecondary}`} onClick={() => router.push("/login")}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
