import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa interface UserState với các trường từ response và email
interface UserState {
  name: string | null;
  email: string | null;
  token: string | null;
  image: string | null;
  status: boolean | null;
}

// Khởi tạo initialState với giá trị mặc định
const initialState: UserState = {
  name: null,
  email: null,
  token: null,
  image: null,
  status: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state.name = action.payload.name ?? state.name;
      state.email = action.payload.email ?? state.email;
      state.token = action.payload.token ?? state.token;
      state.image = action.payload.image ?? state.image;
      state.status = action.payload.status ?? state.status;
    },
    clearUser: (state) => {
      state.name = null;
      state.email = null;
      state.token = null;
      state.image = null;
      state.status = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;