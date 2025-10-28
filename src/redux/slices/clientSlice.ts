import { instance } from "@/api";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface ClientInterface {
  id: number;
  email: string;
  phone: string;
  amc_start: string;
  amc_end: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "EXPIRED";
  token: string;
  domain: string;
  amc_hours: number;
  chargers_for_amc: number;
  increment_value: number;
  amc_charger_count: number;
  chargers?: Charger[];
  totalChargers: number;
}

export interface Charger {
  id: number;
  charger_id: string;
  clientId: number;
  client: ClientInterface; // assuming you have a Client interface
  createdAt: Date;
  updatedAt: Date;
  amc_start: Date;
  amc_end: Date;
  status: string;
  charger_type: string;
}

interface DashboardData {
  totalClients: number;
  totalChargers: number;
  expiringChargers: number;
  newChargers: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  limit: number;
}

interface InitialState {
  clients: ClientInterface[];
  dashBoardData: DashboardData;
  client: ClientInterface | null;
  expiringClientsData: ClientInterface[];
  expiringChargersData: Charger[];
  dashboardLoading: boolean;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  search: string;
  status: string;
}

const initialState: InitialState = {
  clients: [],
  dashBoardData: {
    totalClients: 0,
    totalChargers: 0,
    expiringChargers: 0,
    newChargers: 0,
  },
  client: null,
  expiringChargersData: [],
  expiringClientsData: [],
  dashboardLoading: false,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    limit: 10,
  },
  search: "",
  status: "All",
};

export const fetchDashboardData = createAsyncThunk(
  "/dashboard-data",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instance.get("/dashboard");
      console.log("dashboard Data", res.data);
      if (res && res.data) {
        return res.data.data;
      }
    } catch (error: any) {
      console.log("error");
      rejectWithValue(error.response.data.message);
    }
  }
);

export const getClientsData = createAsyncThunk(
  "clients/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      const res = await instance.get(`/clients?${params.toString()}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clients"
      );
    }
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await instance.delete(`/clients/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete client"
      );
    }
  }
);

export const getClientById = createAsyncThunk(
  "/client/id",
  async (data: { id: string | number }, { rejectWithValue }) => {
    try {
      const res = await instance.get(`/clients/${data.id}`);
      if (res && res.data) {
        return res.data.data;
      }
    } catch (error: any) {
      rejectWithValue(error.response.data.message);
    }
  }
);
const clientSlice = createSlice({
  name: "clientSlice",
  initialState: initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      console.log("search", action.payload);
      state.search = action.payload;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },

    addClient: (state, action: PayloadAction<ClientInterface>) => {
      state.clients.unshift({ ...action.payload, chargers: [] });
    },
    updateClient: (state, action: PayloadAction<ClientInterface>) => {
      const index = state.clients.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.clients[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardData.pending, (state, _) => {
      state.dashboardLoading = true;
    });

    builder.addCase(fetchDashboardData.rejected, (state, _) => {
      state.dashboardLoading = false;
    });
    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.dashboardLoading = false;
      state.dashBoardData = action.payload.stats;
      state.expiringChargersData = action.payload.expiringChargersData;
      state.expiringClientsData = action.payload.expiringClientsData;
    });

    builder
      .addCase(getClientsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientsData.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.data.clients;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getClientsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Client
    builder
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteClient.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.clients = state.clients.filter(
            (client) => client.id !== action.payload
          );
        }
      )
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearch, setStatus, setPage, addClient, updateClient } =
  clientSlice.actions;
export default clientSlice.reducer;
