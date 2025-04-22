import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ThemeState {
  isDarkMode: boolean
  themeColor: string
}

const initialState: ThemeState = {
  isDarkMode: false,
  themeColor: "green",
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload
    },
  },
})

export const { toggleTheme, setThemeColor } = themeSlice.actions
export default themeSlice.reducer
