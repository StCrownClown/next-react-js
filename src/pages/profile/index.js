// src/app/pages/profile/index.js

import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import ReactGA from "react-ga";
ReactGA.pageview("profile");

const ProfilePage = () => {
  ReactGA.pageview("ProfilePage");
  const router = useRouter();

  const [profile, setProfile] = useState({});
  const [flowers, setFlowers] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [flowerImages, setFlowerImages] = useState({});
  const [token, setToken] = useState(null);
  const [loadingFlowerImages, setLoadingFlowerImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [price, setPrice] = useState("");
  const [filename, setFilename] = useState("No file chosen");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const [capturedImageSrc, setCapturedImageSrc] = useState(null);

  useEffect(() => {
    if (showUploadModal) {
      setShowWebcam(false);
    }
  }, [showUploadModal]);

  useEffect(() => {
    if (!showMessageModal) {
      refreshFlowers();
    }
  }, [showMessageModal]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8000/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setProfile(response.data))
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:8000/flowers/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setFlowers(response.data.results))
      .catch((error) => console.error(error));
  }, [token]);

  useEffect(() => {
    flowers.forEach(async (flower) => {
      setLoadingFlowerImages((prev) => ({ ...prev, [flower.id]: true }));
      const base64Image = await fetchImage(flower.id);
      setFlowerImages((prevImages) => ({ ...prevImages, [flower.id]: base64Image }));
      setLoadingFlowerImages((prev) => ({ ...prev, [flower.id]: false }));
    });
  }, [flowers]);

  const capture = () => {
    ReactGA.event("event", {
      category: "profile",
      action: "click",
      label: "capture",
    });

    if (capturedImageSrc) {
      setCapturedImageSrc(null);
      setSelectedImage(null);
      setFilename("No file chosen");
    } else if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImageSrc(imageSrc);
      const blob = dataURItoBlob(imageSrc);
      const file = new File([blob], generateRandomFileName(), { type: "image/jpeg" });
      setSelectedImage(file);
      setFilename(file.name);
    }
  };

  const generateRandomFileName = () => {
    return "flower_" + Date.now() + ".jpg";
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: mimeString });
  };

  async function refreshFlowers() {
    if (!token) {
      console.error("Token not available");
      return;
    }
    
    try {
      const response = await axios.get("http://localhost:8000/flowers/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setFlowers(response.data.results);

      response.data.results.forEach(async (flower) => {
        const base64Image = await fetchImage(flower.id);
        setFlowerImages((prevImages) => ({ ...prevImages, [flower.id]: base64Image }));
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleImageUpload = async () => {
    ReactGA.event("event", {
      category: "profile",
      action: "click",
      label: "handleImageUpload",
    });

    if (!selectedImage) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedImage);
    formData.append("price", price);

    try {
      const response = await axios.post("http://localhost:8000/flowers/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setShowUploadModal(false);
      resetModalData();

      setModalMessage(response.data.message);
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error uploading image:", error);

      resetModalData();

      setModalMessage("Error occurred during the upload. Please try again.");
      setShowMessageModal(true);
    }
  };

  const resetModalData = () => {
    setSelectedImage(null);
    setPrice("");
    setFilename("No file chosen");
  };

  const handleCancel = () => {
    ReactGA.event("event", {
      category: "profile",
      action: "click",
      label: "handleCancel",
    });

    setShowUploadModal(false);
    resetModalData();
  };

  const handleImageSelect = (e) => {
    ReactGA.event("event", {
      category: "profile",
      action: "click",
      label: "handleImageSelect",
    });

    setSelectedImage(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const handleLogout = () => {
    ReactGA.event("event", {
      category: "profile",
      action: "click",
      label: "handleLogout",
    });

    localStorage.removeItem("accessToken");

    setShowLogoutModal(false);

    router.push("/login");
  };

  async function fetchImage(flowerId) {
    const response = await fetch(`http://localhost:8000/flowers/${flowerId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div className={styles.container}>
      <ProfileDetail profile={profile} />
      <FlowerList flowers={flowers} images={flowerImages} loadingImages={loadingFlowerImages} />

      <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={() => setShowUploadModal(true)}>
        Upload new flower
      </button>

      <div>
        <label className="form-label"></label>
      </div>

      <button onClick={() => setShowLogoutModal(true)} className={`btn btn-lg ${styles.logoutButton}`}>
        Logout
      </button>

      {showLogoutModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Are you sure you want to logout?</h3>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button className={`btn ${styles.btnSecondary}`} onClick={() => setShowLogoutModal(false)}>
                No
              </button>
              <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={handleLogout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Upload new flower</h3>

            {showWebcam && (
              <div>
                {capturedImageSrc ? (
                  <Image src={capturedImageSrc} alt="Captured" width={400} height={400} />
                ) : (
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 400,
                      height: 400,
                    }}
                  />
                )}
                <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={capture}>
                  {capturedImageSrc ? "Recapture" : "Capture"}
                </button>
              </div>
            )}

            <button
              className={`btn btn-lg ${styles.customFileInput}`}
              onClick={() => {
                setCapturedImageSrc(null);
                setShowWebcam(!showWebcam);
              }}
            >
              {showWebcam ? "Close Webcam" : "Open Webcam"}
            </button>

            <div>
              <label className="form-label"></label>
            </div>

            {!showWebcam && (
              <div>
                <span className="shotorchoose">OR</span>
              </div>
            )}

            {!showWebcam && (
              <label className={`btn btn-lg ${styles.btnSecondary}`}>
                Choose File
                <input type="file" onChange={handleImageSelect} accept="image/*" hidden />
              </label>
            )}

            <div>
              <label className="form-label"></label>
            </div>

            <span id="fileName">{filename}</span>

            <div>
              <label className="form-label"></label>
            </div>

            <div className={styles.inputField}>
              <label htmlFor="price" className="form-label">
                Price (THB) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="price"
                className="form-control form-control-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>

            <div className={styles.requiredNote}>* Fields are required</div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <button className={`btn ${styles.btnSecondary}`} onClick={handleCancel}>
                Cancel
              </button>
              <button className={`btn btn-lg ${styles.btnPrimary}`} onClick={handleImageUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showMessageModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Upload Response</h3>
            <p>{modalMessage}</p>
            <button className={`btn ${styles.btnSecondary}`} onClick={() => setShowMessageModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileDetail = ({ profile }) => {
  return (
    <div className={styles.profileDetail}>
      <h1>Profile</h1>
      <h2>
        {profile.first_name} {profile.last_name}
      </h2>
      <p>Username: {profile.username}</p>
      <p>Citizen ID: {profile.citizen_id}</p>
      <p>Mobile: {profile.mobile}</p>
      <p>Email: {profile.email}</p>
      <p>Date Joined: {new Date(profile.date_joined).toLocaleDateString()}</p>
    </div>
  );
};

const FlowerList = ({ flowers, images, loadingImages }) => {
  return (
    <div className={styles.flowerList}>
      <h2>Your Flowers</h2>
      <div className={styles.scrollableFlowerList}>
        {flowers.length === 0 ? (
          <div className={styles.centerContent}>
            <p>You do not have any flowers yet.</p>
          </div>
        ) : (
          <ul>
            {flowers.map((flower) => (
              <li key={flower.id}>
                {loadingImages[flower.id] ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  <>
                    {images[flower.id] && <Image src={images[flower.id]} alt="Flower" width={400} height={400} />}
                    <p>
                      <b>Price: {flower.price} THB</b>
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
