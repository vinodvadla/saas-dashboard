import { instance } from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ClientInterface {
  id: number;
  email: string;
  phone: string;
  amc_start: string;
  amc_end: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  token: string;
  domain: string;
  amc_hours: number;
  chargers_for_amc: number;
  increment_value: number;
  totalChargers: number;
}
interface DashboardData {
  totalClients: number;
  totalChargers: number;
  expiringChargers: number;
  newChargers: number;
}

interface InitialState {
  clients: ClientInterface[];
  dashBoardData: DashboardData;
  client: ClientInterface | null;
  expiringClientsData: number;
  expiringChargersData: number;
  dashboardLoading: boolean;
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
  expiringChargersData: 0,
  expiringClientsData: 0,
  dashboardLoading: false,
};

const fetchDashboardData = createAsyncThunk(
  "/dashboard-data",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instance.get("/dashboard-stats");
      if (res && res.data) {
        return res.data.data;
      }
    } catch (error: any) {
      console.log("error");
      rejectWithValue(error.response.data.message);
    }
  }
);

const clientSlice = createSlice({
  name: "clientSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardData.pending, (state, _) => {
      state.dashboardLoading = true;
    });

    builder.addCase(fetchDashboardData.rejected, (state, _) => {
      state.dashboardLoading = false;
    });
    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.dashboardLoading = false;
      state.dashBoardData = action.payload;
    });
  },
});

export default clientSlice;
