import { createSlice } from '@reduxjs/toolkit';

export interface authState {
  isShow: boolean
}

const initialState: authState = {
  isShow: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleShow: (state) => {
      state.isShow = !state.isShow
    }
  }
})

export const {
  toggleShow
} = authSlice.actions

export default authSlice.reducer