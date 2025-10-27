import { useEffect, useState } from "react";
import {
  Users,
  BatteryCharging,
  Clock,
  PlusCircle,
} from "lucide-react";
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

// Define types based on Prisma models
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

// Mock data for demonstration (replace with actual API calls)
const mockClients: Client[] = [
  {
    id: 1,
    email: "client1@example.com",
    phone: "1234567890",
    amc_start: "2025-01-01T00:00:00Z",
    amc_end: "2025-12-31T23:59:59Z",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    status: "ACTIVE",
    chargers: [],
    token: "token1",
    domain: "client1.com",
  },
  {
    id: 2,
    email: "client2@example.com",
    phone: "0987654321",
    amc_start: "2025-06-01T00:00:00Z",
    amc_end: "2025-11-30T23:59:59Z",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
    status: "ACTIVE",
    chargers: [],
    token: "token2",
    domain: "client2.com",
  },
];

const mockChargers: Charger[] = [
  {
    id: 1,
    charger_id: "CHR001",
    clientId: 1,
    client: mockClients[0],
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2025-09-01T00:00:00Z",
    amc_start: "2025-09-01T00:00:00Z",
    amc_end: "2025-11-30T23:59:59Z",
    status: "ACTIVE",
  },
  {
    id: 2,
    charger_id: "CHR002",
    clientId: 2,
    client: mockClients[1],
    createdAt: "2025-10-15T00:00:00Z",
    updatedAt: "2025-10-15T00:00:00Z",
    amc_start: "2025-10-15T00:00:00Z",
    amc_end: "2026-10-14T23:59:59Z",
    status: "ACTIVE",
  },
];

export function DashboardContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);

  // Mock API fetch (replace with actual API calls)
  useEffect(() => {
    // Simulate fetching data
    setClients(mockClients);
    setChargers(mockChargers);
  }, []);

  // Calculate stats
  const totalClients = clients.length;
  const totalChargers = chargers.length;
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const expiringChargers = chargers.filter(
    (charger) =>
      new Date(charger.amc_end) <= thirtyDaysFromNow &&
      new Date(charger.amc_end) >= today
  ).length;

  const newChargers = chargers.filter(
    (charger) =>
      new Date(charger.createdAt) >=
      new Date(today.setMonth(today.getMonth() - 1))
  ).length;

  const expiringClients = clients.filter(
    (client) =>
      new Date(client.amc_end) <= thirtyDaysFromNow &&
      new Date(client.amc_end) >= today
  );

  const stats = [
    {
      title: "Total Clients",
      value: totalClients.toString(),
      icon: Users,
    },
    {
      title: "Total Chargers",
      value: totalChargers.toString(),
      icon: BatteryCharging,
    },
    {
      title: "Expiring Chargers",
      value: expiringChargers.toString(),
      icon: Clock,
    },
    {
      title: "New Chargers",
      value: newChargers.toString(),
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
          <p className="text-muted-foreground">Welcome back to your AMC analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border hover:shadow-elegant transition-shadow">
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
                {expiringClients.length > 0 ? (
                  expiringClients.map((client) => (
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
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
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
                {chargers.filter(
                  (charger) =>
                    new Date(charger.amc_end) <= thirtyDaysFromNow &&
                    new Date(charger.amc_end) >= today
                ).length > 0 ? (
                  chargers
                    .filter(
                      (charger) =>
                        new Date(charger.amc_end) <= thirtyDaysFromNow &&
                        new Date(charger.amc_end) >= today
                    )
                    .map((charger) => (
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
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
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