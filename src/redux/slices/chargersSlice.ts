import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/api";

export interface Charger {
  id: number;
  charger_id: string;
  charger_type: string;
  amc_start: string;
  amc_end: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

interface ChargerState {
  chargers: Charger[];
  charger: Charger | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  search: string;
  status: string;
}

const initialState: ChargerState = {
  chargers: [],
  charger: null,
  pagination: {
    page: 1,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  error: null,
  search: "",
  status: "All",
};

export const fetchChargers = createAsyncThunk(
  "chargers/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "All",
    }: { page?: number; limit?: number; search?: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await instance.get("/chargers", {
        params: { page, limit, search, status },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chargers"
      );
    }
  }
);

export const fetchChargerById = createAsyncThunk(
  "chargers/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await instance.get(`/chargers/${id}`);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch charger"
      );
    }
  }
);

export const updateCharger = createAsyncThunk(
  "chargers/update",
  async (
    {
      id,
      data,
    }: {
      id: number;
      data: { amc_start?: string; amc_end?: string; status?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await instance.put(`/chargers/${id}`, data);
      console.log("res.data", res.data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update charger"
      );
    }
  }
);

export const getChargersByClientId = createAsyncThunk(
  "chargers/client/:id",
  async (
    {
      clientId,
      page = 1,
      limit = 10,
      search = "",
      status = "All",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      status: string;
      clientId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await instance.get("/chargers/client/" + clientId, {
        params: { page, limit, search, status },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chargers"
      );
    }
  }
);

const chargerSlice = createSlice({
  name: "chargers",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setPage(state, action) {
      state.pagination?.page && (state.pagination.page = action.payload);
    },
    resetPagination(state) {
      state.pagination = { total: 0, page: 1, totalPages: 1 };
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChargers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChargers.fulfilled, (state, action) => {
      state.loading = false;
      state.chargers = action.payload.data.chargers;
      state.pagination = action.payload.data.pagination;
    });
    builder.addCase(fetchChargers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchChargerById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChargerById.fulfilled, (state, action) => {
      state.loading = false;
      state.charger = action.payload;
    });
    builder.addCase(fetchChargerById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateCharger.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCharger.fulfilled, (state, action) => {
      state.loading = false;
      state.charger = action.payload;
      const index = state.chargers.findIndex((c) => c.id === action.payload.id);
      let item = {
        ...state.chargers[index],
      };
      if (index !== -1)
        state.chargers[index] = { ...action.payload, client: item.client };
    });
    builder.addCase(updateCharger.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder
      .addCase(getChargersByClientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChargersByClientId.fulfilled, (state, action) => {
        state.loading = false;
        state.chargers = action.payload.data.chargers;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getChargersByClientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearch, setPage, setStatus } = chargerSlice.actions;
export default chargerSlice.reducer;
