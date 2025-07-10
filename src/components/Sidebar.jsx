import {
  FaCashRegister,
  FaChartLine,
  FaShoppingCart,
  FaHistory,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = ({ setActiveContent }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.appTitle}>
          <img
            src="/LogoSwiftPay.png"
            alt="Logo SwiftPay"
            className={styles.logoImage}
          />
          <span>SwiftPay</span>
        </h2>
      </div>
      <div className={styles.menu}>
        <div className={styles.sidebarMenu}>
          <button
            className={styles.menuItem}
            onClick={() => setActiveContent("dashboard")}
          >
            <FaChartLine className={styles.menuIcon} />
            <span>Dashboard</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={() => setActiveContent("transaksi")}
          >
            <FaCashRegister className={styles.menuIcon} />
            <span>New Transaction</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={() => setActiveContent("transaksi-history")}
          >
            <FaHistory className={styles.menuIcon} />
            <span>History</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={() => setActiveContent("produk")}
          >
            <FaShoppingCart className={styles.menuIcon} />
            <span>Products</span>
          </button>
        </div>
        <div className={styles.stockSection}>
          <button
            className={styles.menuItem}
            onClick={() => setActiveContent("stok")}
          >
            <FaChartLine className={styles.menuIcon} />
            <span>Stock</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={() => setActiveContent("stok-history")}
          >
            <FaHistory className={styles.menuIcon} />
            <span>Stock History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
