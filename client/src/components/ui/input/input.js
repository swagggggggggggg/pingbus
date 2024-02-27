import styles from './input.module.css';
import "./input.css"

function InputUI({ label, id, typingFunc, entries, selectEntryFunc, entry }) {

  const focus = (event) => {
    let hide = document.querySelector(`#${id}.Hide`)
    let dialog = document.querySelector(`#${id}.Dialog`)
    let field = document.querySelector(`#${id}-input`)

    hide.classList.add("ShowHide")
    dialog.classList.add("ShowHide")
    field.classList.add("Visible")
  };

  const exit = (event) => {
    let hide = document.querySelector(`#${id}.Hide`)
    let dialog = document.querySelector(`#${id}.Dialog`)
    let field = document.querySelector(`#${id}-input`)

    hide.classList.remove("ShowHide")
    dialog.classList.remove("ShowHide")
    field.classList.remove("Visible")
  };

  return (
    <div className={styles.Input}>
      <div className={styles.Body}>
        <span>{label}:</span>
        <input
          id={id + "-input"}
          onClick={focus}
          className={styles.InputElement}
          onChange={typingFunc}
        />
        <div id={id} className="Dialog">
          <ul>
            {
              entries && entries.map(entry => {
                return (
                  <li key={entry.id} onClick={() => {
                    exit()
                    let input = document.querySelector(`#${id}-input`)
                    input.value = entry.name
                    selectEntryFunc(entry)
                  }}>
                    <span>{entry.name ? entry.name : entry.stop_name}</span>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div id={id} className="Hide" onClick={exit}></div>
    </div>
  );
}

export default InputUI;
