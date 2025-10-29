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
import { BatteryCharging } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  fetchChargers,
  setSearch,
  type Charger,
  updateCharger,
  setStatus,
  setPage,
} from "@/redux/slices/chargersSlice";
import UpdateChargerModal from "@/components/modals/ChargerModal";
import toast from "react-hot-toast";
import PaginationComponent from "@/components/PaginationComponent";

const Chargers: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);

  const { chargers, pagination, search, status } = useSelector(
    (state: RootState) => state.charger
  );
  const dispatch = useDispatch<AppDispatch>();


  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEdit = (charger: Charger) => {
    setEditingCharger(charger);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: Partial<Charger>) => {
    if (editingCharger) {
      dispatch(updateCharger({ id: editingCharger.id, data: data }))
        .unwrap()
        .then((res) => {
          toast.success("Charger updated successfully !");
        })
        .catch((err) => {
          toast.success(err);
        });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        fetchChargers({
          page: pagination.page,
          limit: 2,
          search,
          status,
        })
      );
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [dispatch, pagination.page, search, status]);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <ScrollProgress className="top-[0px] bg-gray-300 h-[1px]" />
        <div className="flex items-center gap-2">
          <BatteryCharging className="h-6 w-6 text-gray-600" />
          <h1 className="text-3xl font-bold tracking-tight">Chargers</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by charger ID..."
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

            <PaginationComponent
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
              onPageChange={(page) => {
                dispatch(setPage(page));
              }}
            />
          </CardContent>
        </Card>

        <UpdateChargerModal
          charger={editingCharger}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default Chargers;
