// components/modals/UpdateChargerModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Charger } from "@/redux/slices/chargersSlice";
import { useEffect, useState } from "react";

interface UpdateChargerModalProps {
  charger: Charger | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Charger>) => void;
}

const UpdateChargerModal: React.FC<UpdateChargerModalProps> = ({
  charger,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    charger_id: charger?.charger_id || "",
    clientId: charger?.client?.id?.toString() || "",
    amc_start: charger?.amc_start.split("T")[0] || "",
    amc_end: charger?.amc_end.split("T")[0] || "",
    status: charger?.status || "ACTIVE",
  });

  useEffect(() => {
    if (charger) {
      setFormData({
        charger_id: charger.charger_id,
        clientId: charger.client?.id?.toString() || "",
        amc_start: charger.amc_start.split("T")[0],
        amc_end: charger.amc_end.split("T")[0],
        status: charger.status,
      });
    }
  }, [charger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Charger</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="charger_id">Charger ID</Label>
            <Input
              id="charger_id"
              value={formData.charger_id}
              onChange={(e) =>
                setFormData({ ...formData, charger_id: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              type="number"
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="amc_start">AMC Start</Label>
            <Input
              id="amc_start"
              type="date"
              value={formData.amc_start}
              onChange={(e) =>
                setFormData({ ...formData, amc_start: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="amc_end">AMC End</Label>
            <Input
              id="amc_end"
              type="date"
              value={formData.amc_end}
              onChange={(e) =>
                setFormData({ ...formData, amc_end: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChargerModal;
