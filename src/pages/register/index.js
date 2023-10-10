// src/app/pages/register/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import ReactGA from "react-ga";
ReactGA.pageview("register");

function RegisterPage() {
  ReactGA.pageview("RegisterPage");
  const router = useRouter();

  const [citizenID, setCitizenID] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };
  const isValidCitizenID = (id) => {
    return /^\d{13}$/.test(id);
  };

  useEffect(() => {
    setCitizenID(localStorage.getItem("citizenID") || "");
    setName(localStorage.getItem("name") || "");
    setLastName(localStorage.getItem("lastName") || "");
    setMobile(localStorage.getItem("mobile") || "");
    setEmail(localStorage.getItem("email") || "");

    const clearDataOnExit = () => {
      localStorage.removeItem("citizenID");
      localStorage.removeItem("name");
      localStorage.removeItem("lastName");
      localStorage.removeItem("mobile");
      localStorage.removeItem("email");
    };

    window.addEventListener("beforeunload", clearDataOnExit);

    return () => {
      window.removeEventListener("beforeunload", clearDataOnExit);
    };
  }, []);

  const handleNext = () => {
    ReactGA.event("event", {
      category: "register",
      action: "click",
      label: "handleNext",
    });

    if (!citizenID || !name || !lastName || !mobile || !email) {
      alert("Please fill out all fields.");
      return;
    }

    if (!isValidCitizenID(citizenID)) {
      alert("Please enter a valid 13-digit Citizen ID.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    localStorage.setItem("citizenID", citizenID);
    localStorage.setItem("name", name);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("mobile", mobile);
    localStorage.setItem("email", email);

    router.push("/create-user");
  };

  const handleBack = () => {
    ReactGA.event("event", {
      category: "register",
      action: "click",
      label: "handleBack",
    });

    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className={styles.title}>Register to Marketplace</h2>

          <div className={styles.inputField}>
            <label className="form-label">
              Citizen ID <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              className="form-control form-control-lg"
              value={citizenID}
              onChange={(e) => setCitizenID(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputField}>
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputField}>
            <label className="form-label">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputField}>
            <label className="form-label">
              Mobile <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputField}>
            <label className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.requiredNote}>* Fields are required</div>

          <div>
            <label className="form-label"></label>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            {" "}
            <button className={`btn ${styles.btnSecondary}`} onClick={handleBack}>
              Back
            </button>{" "}
            <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
