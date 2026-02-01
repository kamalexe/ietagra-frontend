import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: "",
  name: "",
  phone: "",
  role: "",
  department: null,
  id: null
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.email = action.payload.email
      state.name = action.payload.name
      state.phone = action.payload.phone
      state.role = action.payload.role
      state.department = action.payload.department
      state.id = action.payload.id
    },
    unsetUserInfo: (state, action) => {
      state.email = ""
      state.name = ""
      state.phone = ""
      state.role = ""
      state.department = null
      state.id = null
    },
  }
})

export const { setUserInfo, unsetUserInfo } = userSlice.actions

export default userSlice.reducer