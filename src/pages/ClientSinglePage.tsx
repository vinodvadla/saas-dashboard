import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryCharging } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { getClientById } from "@/redux/slices/clientSlice";
import {
  getChargersByClientId,
  setPage,
  setSearch,
  setStatus,
  updateCharger,
  type Charger,
} from "@/redux/slices/chargersSlice";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UpdateChargerModal from "@/components/modals/ChargerModal";
import toast from "react-hot-toast";
import PaginationComponent from "@/components/PaginationComponent";

const ClientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id || "0");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { client } = useSelector((state: RootState) => state.client);
  const { chargers, pagination, search, status } = useSelector(
    (state: RootState) => state.charger
  );

  const handleEdit = (charger: Charger) => {
    setEditingCharger(charger);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: Partial<Charger>) => {
    if (editingCharger) {
      dispatch(updateCharger({ id: editingCharger.id, data: data }))
        .unwrap()
        .then((res) => {
          console.log("res", res);
          toast.success("Charger updated successfully !");
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  useEffect(() => {
    dispatch(getClientById({ id: clientId }));
  }, [clientId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        getChargersByClientId({
          page: pagination.page,
          limit: 1,
          search,
          status,
          clientId,
        })
      );
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [dispatch, pagination.page, search, status, clientId]);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const clientAmcStatus = client
    ? new Date() >= new Date(client.amc_start) &&
      new Date() <= new Date(client.amc_end)
      ? "Active"
      : "Expired"
    : "";

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Chargers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">AC</span>
                      <span className="text-xl font-semibold">
                        {client.acChargers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">DC</span>
                      <span className="text-xl font-semibold">
                        {client.dcChargers}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Active Chargers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {client.activeChargers}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Expiring This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {client.expiringThisMonth}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-muted">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">
                    Added This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {client.addedThisMonth}
                  </div>
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
              value={search}
              onChange={(e) => {
                dispatch(setSearch(e.target.value));
              }}
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
                      chargers.map((charger) => {
                        return (
                          <TableRow
                            key={charger.id}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell>{charger.id}</TableCell>
                            <TableCell>{charger.charger_id}</TableCell>
                            <TableCell>{charger.client?.id}</TableCell>
                            <TableCell>
                              {formatDate(charger.amc_start)}
                            </TableCell>
                            <TableCell>{formatDate(charger.amc_end)}</TableCell>
                            <TableCell>{charger.charger_type}</TableCell>
                            <TableCell>
                              {formatDate(charger.createdAt)}
                            </TableCell>
                            <TableCell>
                              {formatDate(charger.updatedAt)}
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
                        );
                      })
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

              <PaginationComponent
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  dispatch(setPage(page));
                }}
              />

              <UpdateChargerModal
                charger={editingCharger}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientPage;
