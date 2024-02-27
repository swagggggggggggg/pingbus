import styles from './button.module.css';

function ButtonUI({label, clickFunc, reverse}) {
  return (
    <a onClick={clickFunc} className={reverse ? styles.ButtonReverse : styles.Button}>{label}</a>
  );
}

export default ButtonUI;
