"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  submitting?: boolean;
  onConfirm: (actionPassword: string) => void | Promise<void>;
}

export function AdminPasswordDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  submitting = false,
  onConfirm,
}: AdminPasswordDialogProps) {
  const [password, setPassword] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (submitting) return;
    if (!nextOpen) setPassword("");
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (!password.trim()) return;
    await onConfirm(password);
    setPassword("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="adminActionPassword">Action password</Label>
          <Input
            id="adminActionPassword"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            className="mt-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && password.trim() && !submitting) {
                void handleConfirm();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={!password.trim() || submitting}
            onClick={() => void handleConfirm()}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
