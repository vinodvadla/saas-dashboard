import { createSlice } from "@reduxjs/toolkit";

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
};

const clientSlice = createSlice({
  name: "clientSlice",
  initialState: initialState,
  reducers: {},

  extraReducers: (builder) => {},
});

export default clientSlice;
