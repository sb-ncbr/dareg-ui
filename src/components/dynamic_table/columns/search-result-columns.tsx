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
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const rowData = row.original;
      const router = useRouter();

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
            <DropdownMenuItem>Delete Row</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
