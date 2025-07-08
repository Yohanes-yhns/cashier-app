// src/pages/UserPage.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import UserProfileDropdown from "../components/UserProfileDropDown";
import AddProductForm from "../components/AddProductForm"; // pastikan file ini dibuat
import ProductList from "../components/ProductList";
import NewTransaction from "../components/NewTransaction";
import TransactionHistory from "../components/TransactionsHistory";
import StockManagement from "../components/StockManagement";
import StockHistory from "../components/StockHistory";
import styles from "./Userpage.module.css";

const DashboardContent = () => (
  <div className={styles.contentBox}>
    <h2>Dashboard</h2>
    <p>Your statistics revenue</p>
  </div>
);

const TransaksiContent = () => (
  <div className={styles.contentBox}>
    <NewTransaction />
  </div>
);

const ProdukContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 search state

  const handleProductAdded = () => {
    setRefresh((prev) => prev + 1);
    setShowAddForm(false);
  };

  return (
    <div className={styles.contentBox}>
      <div className={styles.contentButton}>
        <button onClick={() => setShowAddForm(false)}>All Products</button>
        <button onClick={() => setShowAddForm(true)}>Add New</button>
      </div>

      {!showAddForm && (
        <input
          type="text"
          placeholder="Find Products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      )}

      {showAddForm ? (
        <AddProductForm onProductAdded={handleProductAdded} />
      ) : (
        <ProductList refresh={refresh} searchQuery={searchQuery} />
      )}
    </div>
  );
};

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [activeContent, setActiveContent] = useState("dashboard"); // State untuk konten aktif

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <DashboardContent />;
      case "transaksi":
        return <TransaksiContent />;
      case "produk":
        return <ProdukContent />;
      case "stok":
        return <StockManagement />;
      case "stok-history":
        return <StockHistory />;
      case "transaksi-history":
        return <TransactionHistory />;
      default:
        return <DashboardContent />;
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <Sidebar setActiveContent={setActiveContent} />
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <UserProfileDropdown user={user} />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default UserPage;
