// src/components/StockHistory.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Swal from "sweetalert2";
import styles from "./StockHistory.module.css";

const StockHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "stockHistory"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setHistory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error loading stock history:", error);
      Swal.fire("Error", "Gagal memuat riwayat stok", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Stock History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No History added</p>
      ) : (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Changes</th>
              <th>Last Stock</th>
              <th>Updated Stock</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.productName}</td>
                <td style={{ color: entry.change >= 0 ? "green" : "red" }}>
                  {entry.change > 0 ? "+" : ""}
                  {entry.change}
                </td>
                <td>{entry.previousStock}</td>
                <td>{entry.newStock}</td>
                <td>{entry.type === "transaction" ? "Transaksi" : "Manual"}</td>
                <td>{entry.createdAt?.toDate().toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockHistory;
