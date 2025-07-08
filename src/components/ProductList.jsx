// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import styles from "./ProductList.module.css";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import Swal from "sweetalert2";

const ProductList = ({ refresh, searchQuery = "" }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "products"),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  const handleDelete = async (productId, productName) => {
    const result = await Swal.fire({
      title: `Hapus "${productName}"?`,
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "products", productId));
        await Swal.fire({
          icon: "success",
          title: "Produk dihapus!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchProducts();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        Swal.fire("Error", "Gagal menghapus produk.", "error");
      }
    }
  };

  const handleEdit = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit Product "${product.name}"`,
      html: `
        <input id="edit-name" class="swal2-input" placeholder="Nama Produk" value="${product.name}" />
        <input id="edit-price" type="number" class="swal2-input" placeholder="Harga Produk" value="${product.price}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const name = document.getElementById("edit-name").value;
        const price = document.getElementById("edit-price").value;
        if (!name || !price) {
          Swal.showValidationMessage("Please fill all the column");
        }
        return { name, price };
      },
    });

    if (formValues) {
      try {
        await updateDoc(doc(db, "products", product.id), {
          name: formValues.name,
          price: parseFloat(formValues.price),
        });
        Swal.fire("Success", "Product updated successfully", "success");
        fetchProducts();
      } catch (error) {
        console.error("Gagal edit:", error);
        Swal.fire("Error", "Failed to update", "error");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  // Filter berdasarkan searchQuery (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h3 style={{ marginBottom: "50px", marginTop: "30px", color: "#3c5b6f" }}>
        Products List
      </h3>

      <div className={styles.listContainer}>
        {filteredProducts.length === 0 ? (
          <p style={{ color: "#888" }}>No products added</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productTitle}>{product.name}</div>
              <div className={styles.productPrice}>
                Rp {product.price.toLocaleString()}
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
