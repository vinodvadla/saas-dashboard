import { instance, setToken } from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthSlice {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthSlice = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "/get-user",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instance.get("/auth/me");
      if (res && res.data) {
        console.log("user data", res.data.data);
        return res.data.data;
      }
    } catch (error: any) {
      rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instance.get("/auth/logout");
      if (res && res.data) {
        console.log("resData", res.data);
        setToken(null);
        return true;
      }
    } catch (error: any) {
      rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/login-user",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      let res = await instance.post("/auth/login", payload);
      if (res && res.data) {
        console.log("Login Response", res.data.data.token);
        setToken(res.data.data.token);
        dispatch(fetchUser());
        return res.data;
      }
    } catch (error: any) {
      rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      console.log("user", action.payload);
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log("success", action.payload);
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default authSlice.reducer;
