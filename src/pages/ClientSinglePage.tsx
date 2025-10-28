import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryCharging, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollProgress from "@/components/eldoraui/scrollprogress";
import { DashboardLayout } from "@/components/SidebarLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: number;
  email: string;
  phone: string;
  amc_start: string;
  amc_end: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  chargers: { id: number }[];
  token: string;
  domain: string;
}

interface Charger {
  id: number;
  charger_id: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;
  amc_start: string;
  amc_end: string;
  status: string;
}

// Mock data (replace with actual API calls)
const mockClients: Client[] = [
  {
    id: 1,
    email: "client1@example.com",
    phone: "123-456-7890",
    amc_start: "2025-01-01T00:00:00Z",
    amc_end: "2025-12-31T23:59:59Z",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    status: "ACTIVE",
    chargers: [{ id: 1 }, { id: 2 }],
    token: "token123",
    domain: "client1.com",
  },
  {
    id: 2,
    email: "client2@example.com",
    phone: "098-765-4321",
    amc_start: "2025-06-01T00:00:00Z",
    amc_end: "2025-11-30T23:59:59Z",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
    status: "INACTIVE",
    chargers: [{ id: 3 }],
    token: "token456",
    domain: "client2.com",
  },
  {
    id: 3,
    email: "client3@example.com",
    phone: "555-555-5555",
    amc_start: "2025-03-01T00:00:00Z",
    amc_end: "2026-02-28T23:59:59Z",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
    status: "ACTIVE",
    chargers: [],
    token: "token789",
    domain: "client3.com",
  },
];

const mockChargers: Charger[] = [
  {
    id: 1,
    charger_id: "CHR001",
    clientId: 1,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
    amc_start: "2025-01-15T00:00:00Z",
    amc_end: "2025-10-14T23:59:59Z",
    status: "ACTIVE",
  },
  {
    id: 2,
    charger_id: "CHR002",
    clientId: 1,
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-07-01T00:00:00Z",
    amc_start: "2025-02-01T00:00:00Z",
    amc_end: "2025-10-31T23:59:59Z",
    status: "INACTIVE",
  },
  {
    id: 3,
    charger_id: "CHR003",
    clientId: 2,
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-08-10T00:00:00Z",
    amc_start: "2025-03-10T00:00:00Z",
    amc_end: "2026-03-09T23:59:59Z",
    status: "ACTIVE",
  },
];

const ClientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id || "0");
  const [client, setClient] = useState<Client | null>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);
  0;
  const [chargerId, setChargerId] = useState("");
  const [amcStart, setAmcStart] = useState("");
  const [amcEnd, setAmcEnd] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    const foundClient = mockClients.find((c) => c.id === clientId);
    setClient(foundClient || null);
    const clientChargers = mockChargers.filter((c) => c.clientId === clientId);
    setChargers(clientChargers);
  }, [clientId]);

  useEffect(() => {
    if (editingCharger) {
      setChargerId(editingCharger.charger_id);
      setAmcStart(editingCharger.amc_start.slice(0, 10));
      setAmcEnd(editingCharger.amc_end.slice(0, 10));
      setStatus(editingCharger.status);
    } else {
      setChargerId("");
      setAmcStart("");
      setAmcEnd("");
      setStatus("ACTIVE");
    }
  }, [editingCharger]);

  // Format date for display
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate metrics
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalChargers = chargers.length;

  const expiringThisMonth = chargers.filter((charger) => {
    const endDate = new Date(charger.amc_end);
    return (
      endDate.getMonth() === currentMonth &&
      endDate.getFullYear() === currentYear
    );
  }).length;

  const addedThisMonth = chargers.filter((charger) => {
    const createDate = new Date(charger.createdAt);
    return (
      createDate.getMonth() === currentMonth &&
      createDate.getFullYear() === currentYear
    );
  }).length;

  const activeChargers = chargers.filter(
    (charger) => charger.status === "ACTIVE"
  ).length;

  // Client AMC status
  const clientAmcStatus = client
    ? new Date() >= new Date(client.amc_start) &&
      new Date() <= new Date(client.amc_end)
      ? "Active"
      : "Expired"
    : "";

  // Filter chargers based on search and status
  const filteredChargers = chargers.filter((charger) => {
    const matchesStatus =
      selectedStatus === "All" || charger.status === selectedStatus;
    const matchesSearch = searchTerm
      ? charger.charger_id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredChargers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentChargers = filteredChargers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharger) {
      const maxId = Math.max(...chargers.map((c) => c.id), 0);
      setChargers((prev) => [
        ...prev,
        {
          id: maxId + 1,
          charger_id: chargerId,
          clientId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          amc_start: `${amcStart}T00:00:00Z`,
          amc_end: `${amcEnd}T00:00:00Z`,
          status,
        },
      ]);
    } else {
      setChargers((prev) =>
        prev.map((c) =>
          c.id === editingCharger.id
            ? {
                ...c,
                charger_id: chargerId,
                amc_start: `${amcStart}T00:00:00Z`,
                amc_end: `${amcEnd}T00:00:00Z`,
                status,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    }
    setDialogOpen(false);
    setEditingCharger(null);
  };

  if (!client) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <p className="text-center text-muted-foreground">Client not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <ScrollProgress className="top-[0px] bg-gray-300 h-[1px]" />
        <Card className="border-border hover:shadow-elegant transition-shadow animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>Client Overview</CardTitle>
              <Badge
                variant={
                  clientAmcStatus === "Active" ? "default" : "destructive"
                }
                className="text-sm px-3 py-1"
              >
                AMC: {clientAmcStatus}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{client.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Domain</Label>
                <p className="font-medium">{client.domain}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Token</Label>
                <p className="break-all text-sm text-gray-600">
                  {client.token}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">AMC Period</Label>
                <p className="font-medium">
                  {formatDate(client.amc_start)} - {formatDate(client.amc_end)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge
                  variant={
                    client.status === "ACTIVE" ? "default" : "destructive"
                  }
                >
                  {client.status}
                </Badge>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Chargers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalChargers}</div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Active Chargers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeChargers}</div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Expiring This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expiringThisMonth}</div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Added This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{addedThisMonth}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging className="h-6 w-6 text-gray-600" />
              <h2 className="text-2xl font-bold tracking-tight">Chargers</h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by charger ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border hover:shadow-elegant transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle>All Chargers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Charger ID</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>AMC Start</TableHead>
                      <TableHead>AMC End</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Updated On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chargers?.length > 0 ? (
                      chargers.map((charger) => (
                        <TableRow
                          key={charger.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>{charger.id}</TableCell>
                          <TableCell>{charger.charger_id}</TableCell>
                          <TableCell>{charger.client?.id}</TableCell>
                          <TableCell>{formatDate(charger.amc_start)}</TableCell>
                          <TableCell>{formatDate(charger.amc_end)}</TableCell>
                          <TableCell>{charger.charger_type}</TableCell>
                          <TableCell>{formatDate(charger.createdAt)}</TableCell>
                          <TableCell>{formatDate(charger.updatedAt)}</TableCell>
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
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(charger)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-muted-foreground"
                        >
                          No chargers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientPage;
