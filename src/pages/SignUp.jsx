import React, { useState } from "react";
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    phoneNumber: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!formData.shopName.trim()) newErrors.shopName = "Nama toko wajib diisi";
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon wajib diisi";
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Format nomor telepon tidak valid";
    }
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        shopName: formData.shopName,
        role: "cashier",
        createdAt: new Date(),
        emailVerified: false
      });

      await sendEmailVerification(userCredential.user);

      await Swal.fire({
        title: "Pendaftaran Berhasil!",
        text: "Silakan cek email Anda untuk verifikasi. Anda akan diarahkan ke halaman login.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true
      });

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Gagal mendaftar";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah";
      }
      
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      
      // Create a new Google provider instance
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account' // Force account selection
      });

      const result = await signInWithPopup(auth, provider);
      
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName || "Google User",
          email: result.user.email,
          phoneNumber: result.user.phoneNumber || "",
          shopName: "Toko Saya",
          role: "cashier",
          createdAt: new Date(),
          emailVerified: result.user.emailVerified
        });

        await Swal.fire({
          title: "Pendaftaran Berhasil!",
          text: "Anda telah berhasil mendaftar dengan Google. Anda akan diarahkan ke halaman login.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        await Swal.fire({
          title: "Login Berhasil!",
          text: "Anda telah berhasil login dengan Google. Anda akan diarahkan ke dashboard.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true
        });
      }
      
      navigate("/login");
    } catch (error) {
      console.error("Google signup error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        Swal.fire({
          title: "Error",
          text: "Gagal mendaftar dengan Google",
          icon: "error"
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <h1>Sign Up</h1>
      
      <form onSubmit={handleEmailSignUp} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama Anda"
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        
        <div className={styles.inputGroup}>
          <label>Nama Toko</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            placeholder="Nama toko/usaha Anda"
          />
          {errors.shopName && <span className={styles.error}>{errors.shopName}</span>}
        </div>
        
        <div className={styles.inputGroup}>
          <label>Nomor Telepon</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Contoh: 081234567890"
          />
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
        </div>
        
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
            placeholder="Minimal 6 karakter"
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          className={styles.primaryButton}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
      
      <div className={styles.divider}>ATAU</div>
      
      <button 
        onClick={handleGoogleSignUp} 
        className={styles.googleButton}
        disabled={googleLoading}
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
        {googleLoading ? "Memproses..." : "Daftar dengan Google"}
      </button>
    </div>
    </>
  );
};

export default SignUp;