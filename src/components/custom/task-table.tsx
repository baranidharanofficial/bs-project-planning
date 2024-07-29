"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export type Task = {
  id: string
  task_name: string
  status: "Ongoing" | "Completed" | "Delayed"
  expected_end_date: string
  percent_complete: number
}

const tasks: Task[] = [
  {
    id: "TASK-0003",
    task_name: "New World",
    status: "Ongoing",
    expected_end_date: "2024-03-30",
    percent_complete: 90.554744526
  },
  {
    id: "TASK-0014",
    task_name: "Hexa",
    status: "Ongoing",
    expected_end_date: "2024-06-05",
    percent_complete: 100.0
  },
  {
    id: "TASK-0004",
    task_name: "Safar Home",
    status: "Ongoing",
    expected_end_date: "2024-03-31",
    percent_complete: 83.013071895
  },
  {
    id: "TASK-0002",
    task_name: "Green Land",
    status: "Ongoing",
    expected_end_date: "2024-01-31",
    percent_complete: 34.489092997
  },
  {
    id: "TASK-0009",
    task_name: "Glory",
    status: "Delayed",
    expected_end_date: "2024-02-29",
    percent_complete: 100.0
  },
  {
    id: "TASK-0010",
    task_name: "OP apartments",
    status: "Ongoing",
    expected_end_date: "2024-04-04",
    percent_complete: 0.0
  },
  {
    id: "TASK-0005",
    task_name: "New Oasis",
    status: "Ongoing",
    expected_end_date: "2024-02-02",
    percent_complete: 50.0
  },
  {
    id: "TASK-0013",
    task_name: "JST",
    status: "Completed",
    expected_end_date: "2024-06-19",
    percent_complete: 100.0
  },
  {
    id: "TASK-0006",
    task_name: "Mini Golf 2",
    status: "Ongoing",
    expected_end_date: "2024-02-19",
    percent_complete: 66.67
  },
  {
    id: "TASK-0011",
    task_name: "Nila",
    status: "Ongoing",
    expected_end_date: "2024-04-10",
    percent_complete: 38.46
  },
  {
    id: "TASK-0012",
    task_name: "Emmanuel Estate's Interior",
    status: "Ongoing",
    expected_end_date: "2024-06-14",
    percent_complete: 40.0
  },
  {
    id: "TASK-0008",
    task_name: "DD Apartments",
    status: "Completed",
    expected_end_date: "2024-06-30",
    percent_complete: 0.0
  },
  {
    id: "TASK-0001",
    task_name: "MidLand",
    status: "Ongoing",
    expected_end_date: "2024-02-23",
    percent_complete: 40.0
  },
  {
    id: "TASK-0007",
    task_name: "Test TASK",
    status: "Ongoing",
    expected_end_date: "2024-02-28",
    percent_complete: 100.0
  }
];

const createColumns = (onTaskClick: (TaskName: string) => void): ColumnDef<Task>[] => [
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
  {
    accessorKey: "id",
    header: "TASKect ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "task_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TASKect
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize ml-4 cursor-pointer hover:underline" onClick={() => onTaskClick(row.getValue("task_name"))}>
        {row.getValue("task_name")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "percent_complete",
    header: "Progress",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("percent_complete")}</div>
    ),
  },
  {
    accessorKey: "expected_end_date",
    header: () => <div className="text-left">End Date</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("expected_end_date")}</div>
    },
  },
];

type DataTableDemoProps = {
  onTaskClick: (TASKectName: string) => void;
};

export function TaskTableDemo({ onTaskClick }: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Task[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setData(tasks);
  }, [])

  const columns = React.useMemo(() => createColumns(onTaskClick), [onTaskClick]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <Tabs defaultValue="all" className="w-full h-full">
      <div className="flex items-center pb-4 h-[10%]">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="delayed">Delayed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </div>

      <div className="flex items-center pb-4 h-[10%]">
        <Input
          placeholder="Filter Task Name..."
          value={(table.getColumn("task_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("task_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: String) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TabsContent value="all" className="rounded-md border h-[65%] overflow-y-auto">
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <div className="flex items-center justify-end space-x-2 py-4 h-[15%]">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
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
    </Tabs>
  )
}
