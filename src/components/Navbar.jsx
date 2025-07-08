import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <FaHome /> KasirApp
      </Link>
      <div className={styles.spacer}></div>
    </nav>
  );
};

export default Navbar;