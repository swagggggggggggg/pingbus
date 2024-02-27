import { configureStore } from '@reduxjs/toolkit'
import tripReducer from "./storage/trip"
export default configureStore({
  reducer: {
    trip: tripReducer
  }
})