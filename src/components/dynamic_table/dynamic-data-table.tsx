import * as React from "react";
import "../../app/globals.css";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable, CellContext,
} from "@tanstack/react-table";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function inferColumns<TData extends object>(data: TData[]): ColumnDef<TData>[] {
  if (!data || data.length === 0) return [];
  return [
    {
      id: "select",
      header: ({ table }) => (
          <Checkbox
              checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
          />
      ),
      cell: ({ row }) => (
          <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
          />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...Object.keys(data[0]).map((key) => ({
      accessorKey: key as keyof TData,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: (info: CellContext<TData, unknown>) => <span>{String(info.getValue())}</span>,
    })),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
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
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(rowData))}
                >
                  Copy Row Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Delete Row</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

export type DynamicDataTableProps<TData extends object> = {
  data: TData[];
  columns?: ColumnDef<TData>[];
  initialState?: Partial<{
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    columnVisibility: VisibilityState;
  }>;
  pageSize?: number;
  pageIndex: number;
  pageCount: number;
  onPageChange: (pageIndex: number) => void;
};

export function DynamicDataTable<TData extends object>({
                                                           data,
                                                           columns,
                                                           initialState,
                                                           pageSize = 10,
                                                           pageIndex,
                                                           pageCount,
                                                           onPageChange,
                                                       }: DynamicDataTableProps<TData>) {
    const cols = React.useMemo(
        () => columns ?? inferColumns(data),
        [columns, data]
    );

    const [sorting, setSorting] = React.useState<SortingState>(
        initialState?.sorting ?? []
    );
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        initialState?.columnFilters ?? []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(initialState?.columnVisibility ?? {});
    const [rowSelection, setRowSelection] = React.useState({}); // Ensure this state is properly managed

    const table = useReactTable({
        data,
        columns: cols,
        pageCount: pageCount,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection, // Pass rowSelection state here
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        manualPagination: true,
        onPaginationChange: (updater) => {
            const nextPageIndex =
                typeof updater === "function"
                    ? updater({ pageIndex, pageSize }).pageIndex
                    : updater.pageIndex;
            if (onPageChange) {
                onPageChange(nextPageIndex);
            }
        },
        onRowSelectionChange: setRowSelection, // Update rowSelection state when a checkbox is toggled
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search..."
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                            {hg.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={cols.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}