import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../src/api";

// Fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/users");
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.msg || e.response?.data || e.message
      );
    }
  }
);

// Add user
export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await API.post("/users/add", user);
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.msg || e.response?.data || e.message
      );
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/users/${id}`, user);
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.msg || e.response?.data || e.message
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/users/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.msg || e.response?.data || e.message
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: { users: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.users.findIndex((u) => u.user_id === updated.user_id);
        if (index !== -1) state.users[index] = updated;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.user_id !== action.payload);
      });
  },
});

export default usersSlice.reducer;