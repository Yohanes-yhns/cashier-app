// src/components/TransactionsHistory.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import styles from "./TransactionsHistory.module.css";

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data transaksi
  const fetchTransactions = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal memuat transaksi",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi hapus transaksi dengan SweetAlert
  const handleDelete = (transactionId) => {
    Swal.fire({
      title: "Hapus Transaksi?",
      text: "Anda tidak dapat mengembalikan transaksi yang sudah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "transactions", transactionId));
          setTransactions(transactions.filter((tx) => tx.id !== transactionId));
          
          Swal.fire({
            title: "Terhapus!",
            text: "Transaksi berhasil dihapus.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting transaction:", error);
          Swal.fire({
            title: "Gagal!",
            text: "Gagal menghapus transaksi",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <h3>Transaction History</h3>

      {loading && <p>Loading...</p>}

      {transactions.length === 0 && !loading && (
        <p>No Transaction History added</p>
      )}

      {transactions.map((tx) => (
        <div key={tx.id} className={styles.transactionCard}>
          <div className={styles.transactionHeader}>
            <strong>Time:</strong>{" "}
            {tx.createdAt?.toDate().toLocaleString("id-ID")}
          </div>
          <button
              onClick={() => handleDelete(tx.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          
          <div className={styles.transactionItems}>
            {tx.items?.map((item, idx) => (
              <div key={idx} className={styles.transactionItem}>
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>

          <div className={styles.transactionTotal}>
            Total: Rp {tx.total?.toLocaleString("id-ID")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsHistory;