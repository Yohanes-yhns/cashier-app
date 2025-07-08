// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.navbar}>
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
        <button
          className={styles.signupBtn}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
        <h1 className={styles.welcomeMessages}>Welcome to Cash app</h1>
      
    </>
  );
};

export default Dashboard;
