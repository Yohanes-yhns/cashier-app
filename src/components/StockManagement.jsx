// src/components/StockManagement.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";
import styles from "./StockManagement.module.css";

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "products"), where("ownerId", "==", user.uid));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      Swal.fire("Error", "Gagal memuat data produk", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = async (product, adjustment) => {
    const newStock = product.stock + adjustment;
    if (newStock < 0) {
      Swal.fire("Error", "Stok tidak boleh negatif", "error");
      return;
    }

    try {
      const batch = writeBatch(db);
      const productRef = doc(db, "products", product.id);

      batch.update(productRef, { stock: newStock });

      const historyRef = doc(collection(db, "stockHistory"));
      batch.set(historyRef, {
        productId: product.id,
        productName: product.name,
        previousStock: product.stock,
        newStock,
        change: adjustment,
        type: "manual_adjustment",
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      await batch.commit();
      Swal.fire("Success", "Stock updated", "success");
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock:", err);
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEditClick = async (product) => {
    const { value: action } = await Swal.fire({
      title: `Edit Stock: ${product.name}`,
      input: "radio",
      inputOptions: {
        add: "+ Stok",
        subtract: "- Stok",
      },
      inputValidator: (value) => {
        if (!value) return "Choose + / -";
      },
      showCancelButton: true,
    });

    if (!action) return;

    const { value: amount } = await Swal.fire({
      title: `Enter ${action === "add" ? "+" : "-"} stock`,
      input: "number",
      inputAttributes: { min: 1 },
      inputValidator: (value) => {
        if (!value || isNaN(value) || parseInt(value) <= 0) {
          return "Enter a valid values";
        }
      },
      showCancelButton: true,
    });

    if (!amount || isNaN(amount)) return;

    const adjustment = action === "add" ? parseInt(amount) : -parseInt(amount);
    await handleStockChange(product, adjustment);
  };

  return (
    <div className={styles.container}>
      <h2>Stock</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products added</p>
      ) : (
        <table className={styles.stockTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(product)}
                  >
                    Edit Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockManagement;
