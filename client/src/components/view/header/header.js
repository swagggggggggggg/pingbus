import styles from './header.module.css';

function Header() {
  return (
    <div className={styles.Header}>
      <h1>
        <a href="/">PingBus</a>
      </h1>
    </div>
  );
}

export default Header;
