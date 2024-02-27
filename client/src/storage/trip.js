import { createSlice } from '@reduxjs/toolkit'

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    value: []
  },
  reducers: {
    setTrip: (state, value) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = value
    },
  }
})

// Action creators are generated for each case reducer function
export const { setTrip } = tripSlice.actions

export default tripSlice.reducer