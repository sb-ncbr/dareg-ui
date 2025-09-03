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
import { FileText, Library, LayoutPanelTop } from "lucide-react";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "collection":
      return (
        <div className="flex items-center w-full justify-start">
          <Library className="h-5 w-5 text-muted-foreground" />
        </div>
      );
    case "dataset":
      return (
        <div className="flex items-center w-full justify-start">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      );
    case "template":
      return (
        <div className="flex items-center w-full justify-start">
          <LayoutPanelTop className="h-5 w-5 text-muted-foreground" />
        </div>
      );
    default:
      return null;
  }
};

export const searchResultColumns = [
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
    id: "type",
    header: "Type",
    cell: ({ row }: any) => {
      const type = row.original.type;
      return <div className="flex justify-center">{getTypeIcon(type)}</div>;
    },
    enableSorting: true,
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
    rowType: "search-result",
    cell: ({ row }: any) => {
      const rowData = row.original;
      const router = useRouter();

      // Determine row type from the search result data
      const rowType = rowData.model || "dataset";
      const { handleDelete, isDeleting } = useDeleteHandler(rowType, {
        redirectAfterDelete: true,
      });

      const getDetailsUrl = (type: string, id: string) => {
        return `/${type}s/${id}`;
      };

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
                navigator.clipboard.writeText(JSON.stringify(rowData, null, 2))
              }
            >
              Copy Row Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                router.push(getDetailsUrl(rowData.type, rowData.id))
              }
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
