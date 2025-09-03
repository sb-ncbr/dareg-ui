"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useApiServiceGetApiV1ProjectsById,
  useApiServiceGetApiV1Users,
  useApiServicePatchApiV1ProjectsById,
  useApiServiceGetApiV1ProjectsByIdKey,
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
import { getSharesColumns } from "@/components/dynamic_table/columns/shares-columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import FacilitiesSelect from "@/components/select/facilities-select";
import TemplateSelectSSR from "@/components/select/template-select";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import { PatchedProject, User } from "../../../../../openapi/requests";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { TypographyH4 } from "@/components/typography/typography-h4";
import { Divider } from "@mui/material";

export default function CollectionSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: collection, isLoading } = useApiServiceGetApiV1ProjectsById({
    id: id as string,
  });

  const { data: users } = useApiServiceGetApiV1Users();

  const [shares, setShares] = useState<any[]>([]);
  const [originalShares, setOriginalShares] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const [newUserId, setNewUserId] = useState<number | undefined>();
  const [newUserPerm, setNewUserPerm] = useState<"editor" | "viewer">("viewer");
  const [newOwner, setNewOwner] = useState<User>();

  const [transferUserId, setTransferUserId] = useState<number | undefined>();
  const [defaultFacility, setDefaultFacility] = useState<string | null>(
    collection?.facility?.id || null
  );
  const [defaultTemplate, setDefaultTemplate] = useState<string | null>(
    collection?.default_dataset_schema?.id || null
  );

  const projectMutation = useApiServicePatchApiV1ProjectsById({
    onSuccess: () => {
      setOriginalShares(shares.map((s) => ({ ...s })));
      setHasChanges(false);
      queryClient.invalidateQueries({
        queryKey: [useApiServiceGetApiV1ProjectsByIdKey, { id: id as string }],
      });
      toast.success("Changes saved successfully!");
    },
  });

  useEffect(() => {
    const shares = collection?.shares;
    if (shares) {
      let sharesArray: any[] = [];
      if (typeof shares === "string") {
        try {
          sharesArray = JSON.parse(shares);
        } catch (error) {
          console.error("Failed to parse shares:", error);
          sharesArray = [];
        }
      } else if (Array.isArray(shares)) {
        sharesArray = shares;
      }

      setShares(sharesArray.map((s: any) => ({ ...s })));
      setOriginalShares(sharesArray.map((s: any) => ({ ...s })));
      setHasChanges(false);
    }
    setDefaultFacility(collection?.facility?.id || null);
    setDefaultTemplate(collection?.default_dataset_schema?.id || null);
  }, [collection]);

  useEffect(() => {
    setHasChanges(JSON.stringify(shares) !== JSON.stringify(originalShares));
  }, [shares, originalShares]);

  useEffect(() => {
    if (
      collection?.facility?.id !== defaultFacility ||
      collection?.default_dataset_schema?.id !== defaultTemplate
    ) {
      setHasChanges(true);
    }
  }, [defaultFacility, defaultTemplate, collection]);

  const canManagePermissions = collection?.perms?.includes("owner");

  const addNewShare = () => {
    const user = users?.results?.find((u: any) => u.id === newUserId);
    if (!user) return;
    setShares((prev) => [...prev, { ...user, perms: newUserPerm }]);
    setAddDialogOpen(false);
    setNewUserId(undefined);
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
    const newOwner = users?.results?.find((u: User) => u.id === transferUserId);
    if (!newOwner) return;
    const filtered = shares.filter(
      (s) => s.perms !== "owner" && s.id !== transferUserId
    );
    setShares([...filtered, { ...newOwner, perms: "owner" }]);
    setTransferDialogOpen(false);
    setTransferUserId(undefined);
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

  const handleSave = async () => {
    try {
      const updatedFields: Partial<PatchedProject> = {};

      if (collection?.name !== undefined) updatedFields.name = collection.name;
      if (collection?.description !== undefined)
        updatedFields.description = collection.description;
      if (defaultFacility !== collection?.facility?.id)
        updatedFields.facility = defaultFacility || undefined;
      if (defaultTemplate !== collection?.default_dataset_schema?.id)
        updatedFields.default_dataset_schema = defaultTemplate || undefined;

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

      await projectMutation.mutateAsync({
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
    <div>
      <Breadcrumbs detailName={collection?.name} />
      <div className="flex items-center justify-start space-x-4">
        <ChevronLeft
          onClick={() => router.back()}
          className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
        />
        <TypographyH2 text="Collection Settings" />
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
      <BoundingBox>
        <div className="mb-4">
          <TypographyH4 text="Collection Settings" />
        </div>
        <Label className="mb-2">Default Facility</Label>
        <FacilitiesSelect
          value={defaultFacility}
          onChange={(facility) => setDefaultFacility(facility.id)}
        ></FacilitiesSelect>
        <Label className="mb-2">Default Template</Label>
        <TemplateSelectSSR
          value={defaultTemplate}
          onChange={(template) => setDefaultTemplate(template.id)}
        ></TemplateSelectSSR>
        <div className="mt-8">
          <TypographyH4 text="Permissions" />
        </div>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <DynamicDataTable
            rowType="share"
            showSearch={false}
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
                    ? availableUsers.find((u: any) => u.id === newUserId)
                        ?.name ?? "Select user"
                    : "Select user"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                {availableUsers.map((user: User) => (
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
              {projectMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </BoundingBox>
      <ToastContainer></ToastContainer>
    </div>
  );
}
