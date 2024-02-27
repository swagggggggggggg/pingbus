import {useState} from "react"
import axios from "axios"
import styles from './search.module.css';
import InputUI from "../../ui/input/input";
import ButtonUI from "../../ui/button/button";
import { useDispatch } from 'react-redux'
import { setTrip } from '../../../storage/trip'


function Search() {

  const dispatch = useDispatch()

  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState({});

  const [stops, setStops] = useState([]);
  const [stop, setStop] = useState({});

  const [buses, setBuses] = useState([]);
  const [bus, setBus] = useState({});

  const findRegion = (event) => {
    if (event.target.value == ""){
      return
    }
    console.log()

    axios.get(`${process.env.REACT_APP_BASE_PATH}/region/${event.target.value}`).then(
      response => {
        setRegions(response.data)
      }
    )
  }

  const findStops = (event) => {
    if (event.target.value == ""){
      return
    }

    axios.post(`${process.env.REACT_APP_BASE_PATH}/stops/${event.target.value}`, {
      region: region.id
    }).then(
        response => {
          setStops(response.data)
        }
    )
  }

  const setStopCustom = (entry) => {
    setStop(entry)

    axios.get(`${process.env.REACT_APP_BASE_PATH}/bus/${entry.id}`).then(response => {
      setBuses(response.data)
    })
  }

  const ping = () => {
    if (stop.id && bus.name) {
      axios.post(`${process.env.REACT_APP_BASE_PATH}/bus-times/`, {
        stopId: stop.id,
        busName: bus.name
      }).then(response => {
        dispatch(setTrip(response.data))
      })
    }
  }

  const clean = () => {
    setRegion({})
    setStop({})
    setBus({})

    let region = document.querySelector(`#bus-input`)
    let stop = document.querySelector(`#bus_stop-input`)
    let bus = document.querySelector(`#bus_number-input`)

    region.value = ""
    stop.value = ""
    bus.value = ""

    dispatch(setTrip([]))
  }

  const findByGeo = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      axios.get(`${process.env.REACT_APP_BASE_PATH}/geo-location/${crd.latitude}/${crd.longitude}/`).then(
        response => {
          let info = response.data
          if (info) {
            setRegion(info.zone_area)
            let region = document.querySelector(`#bus-input`)
            region.value = info.zone_area.name

            let stop = document.querySelector(`#bus_stop-input`)
            stop.value = info.name
            setStopCustom({
              id: info.id,
              name: info.name
            })
          }
        }
      )
    }, () => {
      // On fail
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }

  return (
    <div className={styles.Search}>
      <div>
        <InputUI label="Region" id="bus" typingFunc={findRegion} selectEntryFunc={setRegion} entry={region} entries={regions}/>
        <InputUI label="Bus stop" id="bus_stop" typingFunc={findStops} selectEntryFunc={setStopCustom} entry={stop} entries={stops}/>
        <InputUI label="Bus number" id="bus_number" typingFunc={() => {}} selectEntryFunc={setBus} entry={bus} entries={buses}/>
      </div>
      <div className={styles.ButtonsBlock}>
        <div className={styles.Buttons}>
          <ButtonUI label="Find Geo" reverse={true} clickFunc={findByGeo}/>
          <ButtonUI label="Clean" reverse={true} clickFunc={clean}/>
        </div>
        <ButtonUI label="Ping" clickFunc={ping}/>
      </div>
    </div>
  );
}

export default Search;
