import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERMISSION_MODES, PermissionModes } from "@/types/enums";
import { ChevronDown, DeleteIcon, Trash2Icon } from "lucide-react";
import React from "react";

interface SharesColumnsProps {
  canChange: boolean | undefined;
  handlePermissionChange: (id: string, perms: PermissionModes) => void;
  removeShare: (id: string) => void;
}

export function getSharesColumns({
  canChange,
  handlePermissionChange,
  removeShare,
}: SharesColumnsProps) {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "perms",
      header: "Permissions",
      cell: ({ row }: any) => {
        const rowData = row.original;
        const currentPerm = rowData.perms;
        const otherPerms = PERMISSION_MODES.filter(
          (p) => p !== rowData.perms && p !== "owner"
        );

        const canEdit = canChange && rowData.perms !== "owner";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!canEdit}>
                {currentPerm}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {otherPerms.map((perm) => (
                <DropdownMenuItem
                  key={perm}
                  onClick={() =>
                    canEdit && handlePermissionChange(rowData.id, perm)
                  }
                >
                  {perm}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      rowType: "shares",
      header: "",
      cell: ({ row }: any) => {
        const rowData = row.original;
        const canRemove = canChange && rowData.perms !== "owner";
        return canRemove ? (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeShare(rowData.id)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        ) : null;
      },
    },
  ];
}
