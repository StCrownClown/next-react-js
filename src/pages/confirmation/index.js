// src/app/pages/confirmation/index.js

import { useRouter } from 'next/router';
import styles from './index.module.css';
import ReactGA from "react-ga";
ReactGA.pageview("confirmation");

function ConfirmationPage() {
  ReactGA.pageview("ConfirmationPage");
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className={styles.title}>Confirmation</h2>

          <div className={styles.message}>
            Please confirm your registration by clicking the link sent to your email.
          </div>

          <div className="d-flex justify-content-center align-items-center mt-4">
            <button className={`btn ${styles.btnPrimary}`} onClick={() => router.push('/login')}>Go to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
