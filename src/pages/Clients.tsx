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

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  addClient,
  deleteClient,
  getClientsData,
  setPage,
  setSearch,
  setStatus,
  updateClient,
  type ClientInterface,
} from "@/redux/slices/clientSlice";
import ClientModal from "@/components/modals/ClientModal";
import { instance } from "@/api";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const Clients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, pagination, search, status, loading } = useSelector(
    (s: RootState) => s.client
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const navigate = useNavigate();
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        getClientsData({
          page: pagination.currentPage,
          limit: pagination.limit,
          search,
          status,
        })
      );
    }, 500);

    return () => clearTimeout(handler);
  }, [dispatch, pagination.currentPage, pagination.limit, search, status]);

  const handleSave = async (data: Partial<ClientInterface>) => {
    try {
      if (editingClient) {
        const res = await instance.put("/clients/" + editingClient.id, data);
        let updatedClient = res.data.data;
        dispatch(updateClient(updatedClient));
        toast.success("Client updated successfully!");
        setModalOpen(false);
        setEditingClient(null);
      } else {
        const res = await instance.post("/clients", data);
        let newClient = res.data.data;
        dispatch(addClient(newClient));
        toast.success("Client created successfully!");
        setModalOpen(false);
        setEditingClient(null);
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      toast.error(error.response.data.message || "Failed to save client");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteClient(id))
        .unwrap()
        .then(() => toast.success("Client deleted successfully"))
        .catch((err) => toast.error(err || "Failed to delete client"));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <ScrollProgress className="top-[0px] bg-gray-300 h-[1px]" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          </div>
          <Button
            onClick={() => {
              setEditingClient(null);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by email, phone ..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="flex-1"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              dispatch(setStatus(value));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card className="border-border hover:shadow-elegant transition-shadow animate-fade-in">
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
          </CardHeader>
          {loading ? (
            <Loader />
          ) : (
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
                      <TableHead>AMC Hours</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Chargers</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <TableRow
                          key={client.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>{client.id}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>{formatDate(client.amc_start)}</TableCell>
                          <TableCell>{formatDate(client.amc_end)}</TableCell>
                          <TableCell>{client.amc_hours}</TableCell>
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
                          <TableCell>{client?.chargers?.length}</TableCell>
                          <TableCell
                            className="truncate max-w-[150px]"
                            title={client.token}
                          >
                            {client.token}
                          </TableCell>
                          <TableCell
                            className="truncate max-w-[150px]"
                            title={client.domain}
                          >
                            {client.domain}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigate(`/clients/${client.id}`);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingClient(client);
                                  setModalOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                              <ConfirmDeleteModal
                                onConfirm={() => handleDelete(client.id)}
                                triggerText="Delete"
                                title="Confirm Client Deletion"
                                description={`Are you sure you want to delete ${client.email}?`}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="text-center text-muted-foreground"
                        >
                          No clients found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {/* Previous Button */}
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.currentPage > 1) {
                              dispatch(setPage(pagination.currentPage - 1));
                            }
                          }}
                          className={`${
                            pagination.currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>

                      {/* Page Numbers */}
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(setPage(p));
                            }}
                            isActive={p === pagination.currentPage}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {/* Next Button */}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (
                              pagination.currentPage < pagination.totalPages
                            ) {
                              dispatch(setPage(pagination.currentPage + 1));
                            }
                          }}
                          className={`${
                            pagination.currentPage === pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
      <ClientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingClient={editingClient}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
};

export default Clients;
