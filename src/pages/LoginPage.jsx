import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import styles from "./LoginPage.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await userCredential.user.reload(); // ✅ Refresh status
      const user = auth.currentUser;

      if (!user.emailVerified) {
        await Swal.fire({
          title: "Email Belum Diverifikasi",
          text: "Silakan verifikasi email Anda terlebih dahulu. Kami telah mengirimkan email verifikasi ke alamat email Anda.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      // ✅ Update Firestore jika sebelumnya emailVerified masih false
      await updateDoc(doc(db, "users", user.uid), {
        emailVerified: true,
      });

      await Swal.fire({
        title: "Login Berhasil!",
        text: "Anda akan diarahkan ke dashboard.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/user-page");
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Gagal login";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Email tidak terdaftar";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Password salah";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Terlalu banyak percobaan gagal. Coba lagi nanti atau reset password";
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);

      await Swal.fire({
        title: "Login Berhasil!",
        text: "Anda akan diarahkan ke dashboard.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/user-page");
    } catch (error) {
      console.error("Google login error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        Swal.fire({
          title: "Error",
          text: "Gagal login dengan Google",
          icon: "error",
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Masukkan email Anda",
      inputPlaceholder: "contoh@email.com",
      showCancelButton: true,
      confirmButtonText: "Kirim Link Reset",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) return "Email wajib diisi!";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Format email tidak valid!";
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          title: "Email Terkirim!",
          text: "Silakan cek email Anda untuk instruksi reset password.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error sending reset email:", error);
        Swal.fire({
          title: "Error",
          text: "Gagal mengirim email reset. Pastikan email terdaftar.",
          icon: "error",
        });
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <h1>Login</h1>

      <form onSubmit={handleEmailLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contoh@email.com"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password Anda"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>

      <div className={styles.forgotPassword} onClick={handleForgotPassword}>
        Lupa password?
      </div>

      <div className={styles.divider}>ATAU</div>

      <button
        onClick={handleGoogleLogin}
        className={styles.googleButton}
        disabled={googleLoading}
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
        {googleLoading ? "Memproses..." : "Login dengan Google"}
      </button>

      <div className={styles.signupLink}>
        Belum punya akun?{" "}
        <span onClick={() => navigate("/signup")}>Daftar disini</span>
      </div>
    </div>
    </>
  );
};

export default Login;
