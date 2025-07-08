import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  writeBatch,
  doc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import Swal from "sweetalert2";
import styles from "./NewTransaction.module.css";

const NewTransaction = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "products"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return { id: doc.id, ...d, stock: d.stock ?? 0 }; // pastikan ada stok
    });

    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSaveTransaction = async () => {
  const user = auth.currentUser;
  if (!user || cart.length === 0) return;

  const batch = writeBatch(db);

  try {
    for (const item of cart) {
      const productRef = doc(db, "products", item.id);

      if (typeof item.stock === "undefined") {
        throw new Error(`Stok produk "${item.name}" tidak ditemukan.`);
      }

      const newStock = item.stock - item.quantity;

      if (newStock < 0) {
        Swal.fire("Stok tidak cukup", `Produk "${item.name}" kehabisan stok`, "error");
        return;
      }

      // 1. Update stok produk
      batch.update(productRef, { stock: newStock });

      // 2. Tambah histori stok
      const historyRef = doc(collection(db, "stockHistory"));
      batch.set(historyRef, {
        productId: item.id,
        productName: item.name,
        previousStock: item.stock,
        newStock,
        change: -item.quantity,
        type: "transaction",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    // 3. Simpan transaksi
    await addDoc(collection(db, "transactions"), {
      userId: user.uid,
      createdAt: serverTimestamp(),
      items: cart.map(({ id, name, price, quantity }) => ({
        productId: id,
        name,
        price,
        quantity,
      })),
      total: calculateTotal(),
    });

    await batch.commit();

    Swal.fire("Success", "Transaction successfully and stock updated", "success");
    setCart([]);
    fetchProducts(); // opsional, kalau kamu mau refresh list produk
  } catch (error) {
    console.error("Failed to add transaction", error);
    Swal.fire("Error", error.message || "Failed to add transaction", "error");
  }
};

  return (
    <div className={styles.container}>
      <h3>New Transaction</h3>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <span>
              {product.name} - Rp {product.price.toLocaleString()} (Stok: {product.stock})
            </span>
            <button onClick={() => addToCart(product)}>Add</button>
          </div>
        ))}
      </div>

      <h4>Shopping Cart:</h4>
      {cart.length === 0 && <p>No Transaction added</p>}
      {cart.map((item) => (
        <div key={item.id} className={styles.cartItem}>
          <span>{item.name}</span>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              updateQuantity(item.id, parseInt(e.target.value))
            }
          />
          <span>= Rp {(item.quantity * item.price).toLocaleString()}</span>
          <button onClick={() => removeFromCart(item.id)}>Delete</button>
        </div>
      ))}

      <h4>Total: Rp {calculateTotal().toLocaleString()}</h4>

      <button
        className={styles.saveBtn}
        onClick={handleSaveTransaction}
        disabled={cart.length === 0}
      >
        Save
      </button>
    </div>
  );
};

export default NewTransaction;
