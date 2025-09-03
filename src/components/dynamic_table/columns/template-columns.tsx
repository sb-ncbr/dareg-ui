import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useDeleteHandler } from "@/utils/delete-handlers";

export const templateColumns = [
  {
    id: "select",
    header: ({ table }: { table: Table<any> }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "created_by.full_name",
    accessorKey: "created_by.full_name",
    header: "Creator",
  },
  {
    id: "created",
    accessorKey: "created",
    header: "Created",
    cell: ({ row }: any) => {
      const date = new Date(row.getValue("created"));
      return date.toLocaleDateString("cs-CZ");
    },
  },
  {
    id: "actions",
    header: "Actions",
    rowType: "template",
    cell: ({ row }: any) => {
      const rowData = row.original;
      const router = useRouter();
      const { handleDelete, isDeleting } = useDeleteHandler("template", {
        redirectAfterDelete: true,
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>•••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(rowData))
              }
            >
              Copy Row Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/templates/${rowData.id}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(rowData)}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Row"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
