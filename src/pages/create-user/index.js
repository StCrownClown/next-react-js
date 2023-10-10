// src/app/pages/create-user/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import ReactGA from "react-ga";
ReactGA.pageview("create-user");

function CreateUserPage() {
  ReactGA.pageview("CreateUserPage");
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [citizenID, setCitizenID] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [email, setEmail] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    };

    window.addEventListener("beforeunload", clearDataOnExit);

    return () => {
      window.removeEventListener("beforeunload", clearDataOnExit);
    };
  }, []);

  const handleSubmit = async () => {
    ReactGA.event("event", {
      category: "create-user",
      action: "click",
      label: "handleSubmit",
    });

    if (!username || !password || !citizenID || !name || !lastName || !mobile || !email) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          citizen_id: citizenID,
          first_name: name,
          last_name: lastName,
          mobile: mobile,
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("citizenID");
        localStorage.removeItem("name");
        localStorage.removeItem("lastName");
        localStorage.removeItem("mobile");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        setLoading(false);
        router.push("/confirmation");
      } else {
        setLoading(false);
        setErrorMessage(data.detail || "Failed to register user");
        setShowErrorModal(true);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error during fetch: " + error.message);
      setShowErrorModal(true);
    }
  };

  const handleBack = () => {
    ReactGA.event("event", {
      category: "create-user",
      action: "click",
      label: "handleBack",
    });

    router.push("/register");
  };

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading}>Loading...</div>}
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
          <h2 className={styles.title}>Create User Account</h2>

          <div className={styles.inputField}>
            <label className="form-label">
              Username <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputField}>
            <label className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={handleSubmit}>
              Create
            </button>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-4"></div>
        </div>
      </div>
    </div>
  );
}

export default CreateUserPage;
