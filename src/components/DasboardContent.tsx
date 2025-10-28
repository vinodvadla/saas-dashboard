import { useEffect } from "react";
import { Users, BatteryCharging, Clock, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScrollProgress from "@/components/eldoraui/scrollprogress";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchDashboardData } from "@/redux/slices/clientSlice";

interface Client {
  id: number;
  email: string;
  phone: string;
  amc_start: string;
  amc_end: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  chargers: Charger[];
  token: string;
  domain: string;
}

interface Charger {
  id: number;
  charger_id: string;
  clientId: number;
  client: Client;
  createdAt: string;
  updatedAt: string;
  amc_start: string;
  amc_end: string;
  status: string;
}

export function DashboardContent() {
  const { dashBoardData, expiringChargersData, expiringClientsData } =
    useSelector((state: RootState) => state.client);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, []);

  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const stats = [
    {
      title: "Total Clients",
      value: dashBoardData.totalClients,
      icon: Users,
    },
    {
      title: "Total Chargers",
      value: dashBoardData.totalChargers,
      icon: BatteryCharging,
    },
    {
      title: "Expiring Chargers",
      value: dashBoardData.expiringChargers,
      icon: Clock,
    },
    {
      title: "New Chargers",
      value: dashBoardData.newChargers,
      icon: PlusCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <ScrollProgress className="top-[0px] bg-gray-300 h-[1px]" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your AMC analytics
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-border hover:shadow-elegant transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expiring Clients and Chargers Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expiring Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>AMC End</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringClientsData.length > 0 ? (
                  expiringClientsData.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>
                        {new Date(client.amc_end).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            client.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {client.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No expiring clients
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Expiring Chargers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expiring Chargers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Charger ID</TableHead>
                  <TableHead>Client Email</TableHead>
                  <TableHead>AMC End</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringChargersData.length > 0 ? (
                  expiringChargersData.map((charger) => (
                    <TableRow key={charger.id}>
                      <TableCell>{charger.charger_id}</TableCell>
                      <TableCell>{charger.client.email}</TableCell>
                      <TableCell>
                        {new Date(charger.amc_end).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            charger.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {charger.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No expiring chargers
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
