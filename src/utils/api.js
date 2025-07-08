const BASE_URL = "http://localhost:5000"; 

export const fetchTransactions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/transactions`);
    if (!response.ok) throw new Error("Gagal ambil transaksi");
    return await response.json();
  } catch (error) {
    console.error("Error ambil transaksi:", error);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/products`);
    if (!response.ok) throw new Error("Gagal ambil produk");
    return await response.json();
  } catch (error) {
    console.error("Error ambil produk:", error);
    return [];
  }
};

