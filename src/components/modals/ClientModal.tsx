import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { ClientInterface } from "@/redux/slices/clientSlice";

const clientSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  amc_start: z.string().optional(),
  amc_end: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "INACTIVE", "EXPIRED"]),
  domain: z.string().optional(),
  amc_hours: z.coerce.number().int().min(0).default(0),
  chargers_for_amc: z.coerce.number().int().min(1).default(1),
  increment_value: z.coerce.number().min(0.1).default(1),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClient: ClientInterface | null;
  onSave: (clientData: Partial<ClientInterface>) => void;
}

const DEFAULT_VALUES: ClientFormData = {
  email: "",
  phone: "",
  amc_start: "",
  amc_end: "",
  status: "PENDING",
  domain: "",
  amc_hours: 0,
  chargers_for_amc: 1,
  increment_value: 1,
};

export default function ClientModal({
  open,
  onOpenChange,
  editingClient,
  onSave,
}: ClientModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      if (editingClient) {
        reset({
          email: editingClient.email,
          phone: editingClient.phone,
          amc_start: editingClient.amc_start.slice(0, 10),
          amc_end: editingClient.amc_end.slice(0, 10),
          status: editingClient.status,
          domain: editingClient.domain,
          amc_hours: editingClient.amc_hours ?? 0,
          chargers_for_amc: editingClient.chargers_for_amc ?? 1,
          increment_value: editingClient.increment_value ?? 1,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [editingClient, open, reset]);

  const onSubmit = (data: ClientFormData) => {
    const payload: Partial<ClientInterface> = {
      ...data,
      amc_start: data.amc_start ? `${data.amc_start}T00:00:00.000Z` : undefined,
      amc_end: data.amc_end ? `${data.amc_end}T00:00:00.000Z` : undefined,
      ...(editingClient && { token: editingClient.token }),
    };

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? "Edit Client" : "Add New Client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amc_start">AMC Start</Label>
            <Input id="amc_start" type="date" {...register("amc_start")} />
          </div>

          <div>
            <Label htmlFor="amc_end">AMC End</Label>
            <Input id="amc_end" type="date" {...register("amc_end")} />
          </div>

          <div>
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              type="text"
              {...register("domain")}
              placeholder="example.com"
            />
          </div>
          {editingClient && (
            <div>
              <Label htmlFor="token">Token (Auto-generated)</Label>
              <Input
                id="token"
                type="text"
                value={editingClient.token}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Generated on creation. Cannot be changed.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="amc_hours">AMC Hours</Label>
            <Input
              id="amc_hours"
              type="number"
              {...register("amc_hours")}
              min="0"
              step="1"
            />
          </div>

          <div>
            <Label htmlFor="chargers_for_amc">Chargers for AMC</Label>
            <Input
              id="chargers_for_amc"
              type="number"
              {...register("chargers_for_amc")}
              min="1"
              step="1"
            />
          </div>

          <div>
            <Label htmlFor="increment_value">Increment Value</Label>
            <Input
              id="increment_value"
              type="number"
              {...register("increment_value")}
              min="0.1"
              step="0.1"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingClient
                ? "Update Client"
                : "Create Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
