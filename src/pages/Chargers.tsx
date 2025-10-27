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

// Mock data (replace with actual API call)
const mockChargers: Charger[] = [
  {
    id: 1,
    charger_id: "CHR001",
    clientId: 1,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
    amc_start: "2025-01-15T00:00:00Z",
    amc_end: "2026-01-14T23:59:59Z",
    status: "ACTIVE",
  },
  {
    id: 2,
    charger_id: "CHR002",
    clientId: 1,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-07-01T00:00:00Z",
    amc_start: "2025-02-01T00:00:00Z",
    amc_end: "2026-01-31T23:59:59Z",
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

const Chargers: React.FC = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);

  // Form states
  const [chargerId, setChargerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [amcStart, setAmcStart] = useState("");
  const [amcEnd, setAmcEnd] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  // Simulate fetching chargers data (replace with actual API call)
  useEffect(() => {
    setChargers(mockChargers);
  }, []);

  useEffect(() => {
    if (editingCharger) {
      setChargerId(editingCharger.charger_id);
      setClientId(editingCharger.clientId.toString());
      setAmcStart(editingCharger.amc_start.slice(0, 10));
      setAmcEnd(editingCharger.amc_end.slice(0, 10));
      setStatus(editingCharger.status);
    } else {
      setChargerId("");
      setClientId("");
      setAmcStart("");
      setAmcEnd("");
      setStatus("ACTIVE");
    }
  }, [editingCharger]);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharger) {
      // Create new charger
      const maxId = Math.max(...chargers.map((c) => c.id), 0);
      setChargers((prev) => [
        ...prev,
        {
          id: maxId + 1,
          charger_id: chargerId,
          clientId: parseInt(clientId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          amc_start: `${amcStart}T00:00:00Z`,
          amc_end: `${amcEnd}T00:00:00Z`,
          status,
        },
      ]);
    } else {
      // Update existing charger
      setChargers((prev) =>
        prev.map((c) =>
          c.id === editingCharger.id
            ? {
                ...c,
                charger_id: chargerId,
                clientId: parseInt(clientId),
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

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <ScrollProgress className="top-[0px] bg-gray-300 h-[1px]" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold tracking-tight">Chargers</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCharger(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Charger
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCharger ? "Edit Charger" : "Create Charger"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="chargerId">Charger ID</Label>
                  <Input
                    id="chargerId"
                    value={chargerId}
                    onChange={(e) => setChargerId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    type="number"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amc_start">AMC Start</Label>
                  <Input
                    id="amc_start"
                    type="date"
                    value={amcStart}
                    onChange={(e) => setAmcStart(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amc_end">AMC End</Label>
                  <Input
                    id="amc_end"
                    type="date"
                    value={amcEnd}
                    onChange={(e) => setAmcEnd(e.target.value)}
                    required
                  />
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

        {/* Chargers Table */}
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
                    <TableHead>Created On</TableHead>
                    <TableHead>Updated On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentChargers.length > 0 ? (
                    currentChargers.map((charger) => (
                      <TableRow
                        key={charger.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>{charger.id}</TableCell>
                        <TableCell>{charger.charger_id}</TableCell>
                        <TableCell>{charger.clientId}</TableCell>
                        <TableCell>{formatDate(charger.amc_start)}</TableCell>
                        <TableCell>{formatDate(charger.amc_end)}</TableCell>
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
                            onClick={() => {
                              setEditingCharger(charger);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
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

export default Chargers;