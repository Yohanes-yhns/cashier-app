// src/components/UserProfileDropdown.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import styles from "./UserProfileDropDown.module.css";

const UserProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileButton} onClick={toggleDropdown}>
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className={styles.profileImage}
          />
        ) : (
          <div className={styles.profileInitial}>
            {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
          </div>
        )}
        <span className={styles.profileName}>
          {user.displayName || user.email.split('@')[0]}
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div 
            className={styles.dropdownItem}
            onClick={() => navigate("/profile")}
          >
            <FaUser className={styles.dropdownIcon} />
            <span>My Profile</span>
          </div>
          <div 
            className={styles.dropdownItem}
            onClick={handleLogout}
          >
            <FaSignOutAlt className={styles.dropdownIcon} />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;