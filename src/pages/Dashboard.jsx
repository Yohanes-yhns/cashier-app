// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <img
              src="/LogoSwiftPay.png"
              alt="Logo SwiftPay"
              className={styles.logoImage}
            />
          </Link>
        </div>
        <div className={styles.right}>
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className={styles.signupBtn}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.textSection}>
          <h2 className={styles.title}>
            Kelola Transaksi Lebih Cepat & Efisien
          </h2>
          <p className={styles.subtitle}>
            Aplikasi kasir modern yang memudahkan pencatatan penjualan, stok,
            dan laporan secara otomatis.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className={styles.ctaButton}
          >
            Mulai Gratis Sekarang
          </button>
        </div>

        <div className={styles.imageSection}>
          {/* Ganti dengan gambar dashboard/ilustrasi nantinya */}
          <img
            src="/your-illustration.png"
            alt="Illustration of using SwiftPay"
            className={styles.heroImage}
          />
        </div>
      </main>
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>Fitur Unggulan SwiftPay</h2>
          <p className={styles.featuresSubtitle}>
            Kelola bisnis lebih efisien dengan sistem kasir yang pintar dan
            terintegrasi.
          </p>

          <div className={styles.featureGrid}>
            <div className={styles.featureBox}>
              <h3>📦 Stok Otomatis</h3>
              <p>
                Jumlah stok langsung berkurang saat transaksi dilakukan. Tidak
                perlu input manual.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h3>📊 Laporan Penjualan</h3>
              <p>
                Dapatkan laporan harian, mingguan, hingga bulanan. Rapi,
                lengkap, dan mudah diekspor.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h3>🧾 Cetak & Download</h3>
              <p>
                Cetak struk atau ekspor laporan ke PDF/Excel hanya dengan satu
                klik.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footer1}>
            <img
              src="/LogoSwiftPay.png"
              alt="Logo SwiftPay"
              className={styles.footerLogo}
            />
            <p className={styles.footerText}>
              SwiftPay — solusi kasir modern yang membantu kamu mengelola bisnis
              dengan cepat, cerdas, dan aman.
            </p>
          </div>

          <div className={styles.footer2}>
            <h4>Menu</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="/">Beranda</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
              <li>
                <a href="/about">Tentang Kami</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} SwiftPay. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
