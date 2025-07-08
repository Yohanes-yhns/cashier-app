// src/components/AddProductForm.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import styles from "./AddProductForm.module.css";

const AddProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!name.trim() || !price || parseFloat(price) <= 0 || stock < 0) {
      Swal.fire({
        icon: "warning",
        title: "Input not Valid",
        text: "Product Name, Price (> 0), and Stock (≥ 0) must be filled in correctly.",
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Swal.fire("Error", "User need to login", "error");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      setName("");
      setPrice("");
      setStock(0);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `"${name}" successfully added to product list.`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add new product</h3>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Price"
        min="1"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Stok Awal"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />

      <button type="submit" className={styles.submitButton}>
        Save Product
      </button>
    </form>
  );
};

export default AddProductForm;
