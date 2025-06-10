import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const datasetColumns = [
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
    cell: ({ row }: any) => {
      const rowData = row.original;
      const router = useRouter();

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
              onClick={() => router.push(`/datasets/${rowData.id}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Delete Row</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
