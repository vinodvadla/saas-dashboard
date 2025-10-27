import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";
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

interface Client {
  id: number;
  email: string;
  phone: string;
  amc_start: string;
  amc_end: string;
  createdAt: string;
  status: string;
  chargers: { id: number }[];
  token: string;
  domain: string;
}

const mockClients: Client[] = [
  {
    id: 1,
    email: "client1@example.com",
    phone: "123-456-7890",
    amc_start: "2025-01-01T00:00:00Z",
    amc_end: "2025-12-31T23:59:59Z",
    createdAt: "2025-01-01T00:00:00Z",
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
    status: "ACTIVE",
    chargers: [],
    token: "token789",
    domain: "client3.com",
  },
];

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amcStart, setAmcStart] = useState("");
  const [amcEnd, setAmcEnd] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [token, setToken] = useState("");
  const [domain, setDomain] = useState("");

  // Simulate fetching clients data (replace with actual API call)
  useEffect(() => {
    setClients(mockClients);
  }, []);

  useEffect(() => {
    if (editingClient) {
      setEmail(editingClient.email);
      setPhone(editingClient.phone);
      setAmcStart(editingClient.amc_start.slice(0, 10));
      setAmcEnd(editingClient.amc_end.slice(0, 10));
      setStatus(editingClient.status);
      setToken(editingClient.token);
      setDomain(editingClient.domain);
    } else {
      setEmail("");
      setPhone("");
      setAmcStart("");
      setAmcEnd("");
      setStatus("ACTIVE");
      setToken("");
      setDomain("");
    }
  }, [editingClient]);

  // Format date for display
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter clients based on search and status
  const filteredClients = clients.filter((client) => {
    const matchesStatus =
      selectedStatus === "All" || client.status === selectedStatus;
    const matchesSearch = searchTerm
      ? client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.token.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirst, indexOfLast);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      email,
      phone,
      amc_start: `${amcStart}T00:00:00Z`,
      amc_end: `${amcEnd}T00:00:00Z`,
      status,
      token,
      domain,
    };

    if (editingClient) {
      // Update
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id ? { ...c, ...newClient } : c
        )
      );
    } else {
      // Create
      const maxId = Math.max(...clients.map((c) => c.id), 0);
      setClients((prev) => [
        ...prev,
        {
          ...newClient,
          id: maxId + 1,
          createdAt: new Date().toISOString(),
          chargers: [],
        },
      ]);
    }
    setDialogOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      if (currentClients.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <ScrollProgress className="top-[0px] bg-gray-300 h-[1px]" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingClient(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingClient ? "Edit Client" : "Create Client"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="amc_start">AMC Start</Label>
                  <Input id="amc_start" type="date" value={amcStart} onChange={(e) => setAmcStart(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="amc_end">AMC End</Label>
                  <Input id="amc_end" type="date" value={amcEnd} onChange={(e) => setAmcEnd(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="token">Token</Label>
                  <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} required />
                </div>
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by email, phone, domain, or token..."
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

        {/* Clients Table */}
        <Card className="border-border hover:shadow-elegant transition-shadow animate-fade-in">
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>AMC Start</TableHead>
                    <TableHead>AMC End</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Chargers</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClients.length > 0 ? (
                    currentClients.map((client) => (
                      <TableRow
                        key={client.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>{client.id}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{formatDate(client.amc_start)}</TableCell>
                        <TableCell>{formatDate(client.amc_end)}</TableCell>
                        <TableCell>{formatDate(client.createdAt)}</TableCell>
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
                        <TableCell>{client.chargers.length}</TableCell>
                        <TableCell className="truncate max-w-[150px]" title={client.token}>
                          {client.token}
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]" title={client.domain}>
                          {client.domain}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingClient(client);
                                setDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(client.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground">
                        No clients found
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
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clients;