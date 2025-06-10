"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useApiServiceGetApiV1DatasetsById,
  useApiServiceGetApiV1Users,
  useApiServicePatchApiV1DatasetsById,
} from "../../../../../openapi/queries";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { ChevronDown, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { useSession } from "next-auth/react";
import { getSharesColumns } from "@/components/dynamic_table/columns/shares-columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";
import { PatchedDataset } from "../../../../../openapi/requests";

export default function SettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: dataset, isLoading } = useApiServiceGetApiV1DatasetsById({
    id: id as string,
  });

  const { data: users } = useApiServiceGetApiV1Users();

  const [shares, setShares] = useState<any[]>([]);
  const [originalShares, setOriginalShares] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const [newUserId, setNewUserId] = useState("");
  const [newUserPerm, setNewUserPerm] = useState<"editor" | "viewer">("viewer");

  const [transferUserId, setTransferUserId] = useState("");

  useEffect(() => {
    if (dataset?.shares) {
      setShares(dataset.shares.map((s: any) => ({ ...s })));
      setOriginalShares(dataset.shares.map((s: any) => ({ ...s })));
      setHasChanges(false);
    }
  }, [dataset]);

  useEffect(() => {
    setHasChanges(JSON.stringify(shares) !== JSON.stringify(originalShares));
  }, [shares, originalShares]);

  const canManagePermissions = dataset?.perms?.includes("owner");

  const addNewShare = () => {
    const user = users?.results?.find((u: any) => u.id === newUserId);
    if (!user) return;
    setShares((prev) => [...prev, { ...user, perms: newUserPerm }]);
    setAddDialogOpen(false);
    setNewUserId("");
  };

  const handlePermissionChange = (rowId: string, newPerm: string) => {
    setShares((prev) =>
      prev.map((share) =>
        share.id === rowId ? { ...share, perms: newPerm } : share
      )
    );
  };

  const removeShare = (rowId: string) => {
    setShares((prev) => prev.filter((share) => share.id !== rowId));
  };

  const transferOwner = () => {
    const newOwner = users?.results?.find((u: any) => u.id === transferUserId);
    if (!newOwner) return;
    const filtered = shares.filter(
      (s) => s.perms !== "owner" && s.id !== transferUserId
    );
    setShares([...filtered, { ...newOwner, perms: "owner" }]);
    setTransferDialogOpen(false);
    setTransferUserId("");
  };

  const availableUsers = users?.results
    ? users.results.filter(
        (u: any) => !shares.some((s) => s.id === u.id) && u.name !== " "
      )
    : [];

  const transferUsers = users?.results
    ? users.results.filter(
        (u: any) =>
          u.name !== " " && u.id !== shares.find((s) => s.perms === "owner")?.id
      )
    : [];

  const columns = getSharesColumns({
    canChange: canManagePermissions,
    handlePermissionChange,
    removeShare,
  });

  const permisssionMutation = useApiServicePatchApiV1DatasetsById({
    onSuccess: () => {
      setOriginalShares(shares.map((s) => ({ ...s })));
      setHasChanges(false);
      toast.success("Permissions updated successfully!");
    },
  });

  const handleSave = async () => {
    try {
      const updatedFields: Partial<PatchedDataset> = {};

      if (JSON.stringify(shares) !== JSON.stringify(originalShares)) {
        updatedFields.shares = shares.map((s) => ({
          id: s.id,
          name: s.name,
          perms: s.perms,
        }));
      }

      if (Object.keys(updatedFields).length === 0) {
        toast.warning("No changes to save.");
        return;
      }

      await permisssionMutation.mutateAsync({
        id: id as string,
        requestBody: updatedFields,
      });
    } catch (error: any) {
      toast.error(
        "Failed to save changes. Please try again. Error: \n" + error.message
      );
    }
  };

  return (
    <main className="mb-10 max-w-[70vh]">
      <div>
        <Breadcrumbs detailName={dataset?.name} />
      </div>
      <div className="flex items-center justify-start space-x-4">
        <ChevronLeft
          onClick={() => router.back()}
          className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
        />
        <TypographyH2 text="Dataset Settings" />
        <div className="flex-1" />
        <Button
          variant="outline"
          onClick={() => setTransferDialogOpen(true)}
          disabled={!canManagePermissions}
        >
          Transfer Ownership
        </Button>
        <Button
          variant="outline"
          onClick={() => setAddDialogOpen(true)}
          disabled={!canManagePermissions}
        >
          Add User
        </Button>
      </div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DynamicDataTable
          data={shares}
          columns={columns}
          pageIndex={0}
          pageCount={1}
          onPageChange={() => {}}
        />
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mb-4">
                {newUserId
                  ? availableUsers.find((u: any) => u.id === newUserId)?.name ??
                    "Select user"
                  : "Select user"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              {availableUsers.map((user: any) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => setNewUserId(user.id)}
                  className={newUserId === user.id ? "font-bold" : ""}
                >
                  {user.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogFooter>
            <Button onClick={addNewShare} disabled={!newUserId}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
          </DialogHeader>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mb-4">
                {transferUserId
                  ? transferUsers.find((u: any) => u.id === transferUserId)
                      ?.name ?? "Select user"
                  : "Select user"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              {transferUsers.map((user: any) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => setTransferUserId(user.id)}
                  className={transferUserId === user.id ? "font-bold" : ""}
                >
                  {user.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTransferDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={transferOwner} disabled={!transferUserId}>
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 flex space-x-4">
          <Button
            variant="destructive"
            size="xl"
            onClick={() =>
              setShares(originalShares.map((s: any) => ({ ...s })))
            }
          >
            Revert Changes
          </Button>
          <Button
            variant="default"
            size="xl"
            onClick={() => {
              handleSave();
            }}
          >
            {permisssionMutation.isPending ? (
              <span className="animate-pulse ml-1">Saving...</span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}
    </main>
  );
}
