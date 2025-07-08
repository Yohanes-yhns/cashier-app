import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import Swal from "sweetalert2";
import styles from "./WaitingVerification.module.css";

const WaitingVerification = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Cek apakah email sudah diverifikasi (opsional)
  useEffect(() => {
    const interval = setInterval(() => {
      user?.reload().then(() => {
        if (user?.emailVerified) {
          clearInterval(interval);
          navigate("/login");
        }
      });
    }, 5000); // Cek setiap 5 detik

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleResendEmail = async () => {
    try {
      await sendEmailVerification(user);
      Swal.fire({
        title: "Email Terkirim!",
        text: "Link verifikasi baru telah dikirim.",
        icon: "success",
        confirmButtonColor: "#5EABD6"
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#5EABD6"
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verifikasi Email Anda</h1>
      <p className={styles.description}>
        Kami telah mengirim link verifikasi ke <b>{user?.email}</b>.
        Klik link tersebut untuk mengaktifkan akun.
      </p>
      <div className={styles.actions}>
        <button 
          onClick={handleResendEmail}
          className={styles.resendButton}
        >
          Kirim Ulang Email
        </button>
        <button 
          onClick={() => navigate("/login")}
          className={styles.loginButton}
        >
          Sudah Verifikasi? Login
        </button>
      </div>
    </div>
  );
};

export default WaitingVerification;