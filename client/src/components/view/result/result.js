import styles from './result.module.css';
import { useSelector } from 'react-redux'

function Result() {

  const trip = useSelector(state => state.trip.value)

  return (
    <div className={styles.Result}>
      <h3>Results</h3>

      <div className={styles.Body}>
        {
          trip.payload && trip.payload.map(t => {
            return(
              <div className={styles.Entry}>
                <b>{t.arrival_time} - {t.departure_time}</b>
                <span>{t.trip.trip_headsign}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default Result;
