// src/app/pages/login/index.js

import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import ReactGA from "react-ga";
ReactGA.pageview("login");

function LoginPage() {
  ReactGA.pageview("LoginPage");
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    ReactGA.event("event", {
      category: "login",
      action: "click",
      label: "handleLogin",
    });

    if (!username || !password) {
      alert("Both username and password are required!");

      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/dj-rest-auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.access);
        setLoading(false);

        router.push("/profile");
      } else {
        setLoading(false);
        setErrorMessage(data.detail || "Failed to login.");
        setShowErrorModal(true);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error during fetch: " + error.message);
      setShowErrorModal(true);

      eventGA("login", {
        event_category: "login",
        event_label: "fail",
      });
    }
  };

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading}>Logging in...</div>}
      {showErrorModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Error</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorModal(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className={styles.title}>
            <b>Flower Marketplace</b>
          </h2>

          <div className={styles.inputField}>
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={handleLogin}>
              Login
            </button>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-4">
            <button className={`btn ${styles.btnSecondary}`} onClick={() => router.push("/register")}>
              Register
            </button>
            <button className={`btn btn-link ${styles.btnLink}`} onClick={() => router.push("/reset-password")}>
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
