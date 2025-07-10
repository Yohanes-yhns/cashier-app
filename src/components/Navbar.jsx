import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img
          src={`${process.env.PUBLIC_URL}LogoSwiftPay.png`}
          alt="Logo SwiftPay"
          className={styles.logoImage}
        />
      </Link>
      <div className={styles.spacer}></div>
    </nav>
  );
};

export default Navbar;
