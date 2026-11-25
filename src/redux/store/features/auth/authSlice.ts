import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "@/types/auth.types";

interface AuthState {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ✅ Initial state: empty, will rehydrate on client
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user + tokens (login)
    setUser(
      state,
      action: PayloadAction<{ user: TUser; accessToken: string; refreshToken?: string }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
    },

    // Update access token only (after refresh)
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload);
      }
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // Logout: clear everything
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  },
});

export const { setUser, setAccessToken, setIsLoading, logout } =
  authSlice.actions;

export default authSlice.reducer;
