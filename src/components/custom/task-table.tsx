"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { RiBuilding2Line } from "react-icons/ri";
import { Progress } from "../ui/progress";
import { formatDate, getDaysLeft } from "./date-format";
import DataTable from "./table";

export interface Task {
  task_id: string;
  title: string;
  category: string;
  status: "In Progress" | "Completed" | "Pending" | "Not Started";
  expected_end_date: string | null;
  estimated_work: number;
  unit: string;
  progress: number;
}

export interface TimelineEntry {
    title: string;
    photo: string[];
    status_update: string;
    date: string;
    task_update_id: string;
    task_progress: number;
    unit: string;
    remark: string;
    updated_by: string;
}

export interface TaskDetails {
  id: string;
  task_name: string;
  priority: string;
  category: string;
  status: string;
  task_progress: number;
  project_id: string;
  unit: string;
  estimated_work: number;
  start_date: string;
  end_date: string;
  assignee: Assignee[];
  estimated_cost: number;
  description: string;
  timeline: Timeline[];
  unit_change_limit_reached: boolean;
  tags: string[];
}

export interface Assignee {
  user_email: string;
  user_name: string;
}

export interface Timeline {
  title: string;
  photo: Photo[];
  status_update: string;
  date: string;
  task_update_id: string;
  task_progress: number;
  unit: string;
  remark: string;
  updated_by: string;
}

export interface Photo {
  id: string;
  filename: string;
  file_url: string;
  file_url_with_protocol: string;
  filetype: string;
  timestamp_of_upload: string;
}

const createColumns = (
  onTaskClick: (task: Task) => void
): ColumnDef<Task>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div
          className="capitalize ml-4 cursor-pointer flex items-center"
          onClick={() => {
            onTaskClick(row.original);
            console.log(row.original.category);
          }}
        >
          <div className="bg-green-50 border-green-300 border-[1px] rounded-md p-2 mr-2">
            <RiBuilding2Line className="text-4xl text-green-700 dark:text-white " />
          </div>
          <div>
            <p className="text-md font-semibold mb-1  hover:underline">
              {row.getValue("title")}
            </p>
            <p className="!text-[8px] text-slate-400">{category}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: undefined,
    cell: undefined,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        onClick={() => {
            onTaskClick(row.original);
        }}
        className={`capitalize w-max px-2 py-1 rounded-sm ${
          row.getValue("status") !== "Delayed" ? "bg-green-200" : "bg-red-200"
        }`}
      >
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div
        onClick={() => {
          onTaskClick(row.original);
        }}
      >
        <Progress
          className="h-2 bg-green-100 w-[80%] mb-1"
          indicatorColor="bg-green-500"
          value={parseInt(row.getValue("progress"), 10)}
        />
        <p className="capitalize">
          {String(row.getValue("progress")).split(".")[0]} %
        </p>
      </div>
    ),
  },
  {
    accessorKey: "expected_end_date",
    header: () => <div className="text-left">End Date</div>,
    cell: ({ row }) => {
      return (
        <div
          onClick={() => {
            onTaskClick(row.original);
          }}
          className="text-left font-medium"
        >
          <p>{formatDate(row.getValue("expected_end_date"))}</p>
          <p className="text-sm text-slate-400">{getDaysLeft(row.getValue("expected_end_date")) == 0 ? "Delayed" : getDaysLeft(row.getValue("expected_end_date"))}</p>
        </div>
      );
    },
  },
];

type DataTableDemoProps = {
  tasks: Task[];
  categories: string[];
  onTaskClick: (task: Task) => void;
  onAddTaskClick: () => void;
};

export function TaskTable({
  onTaskClick,
  onAddTaskClick,
  tasks,
  categories,
}: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [tab, setTab] = React.useState("all");
  const [category, setCategory] = React.useState("all");

  const columns = React.useMemo(
    () => createColumns(onTaskClick),
    [onTaskClick]
  );

  const table = useReactTable({
    data: tasks,
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
  });

  React.useEffect(() => {
    const statusFilter =
      tab === "all" ? undefined : tab.charAt(0).toUpperCase() + tab.slice(1);
    setColumnFilters((filters) => {
      const newFilters = filters.filter((filter) => filter.id !== "status");
      return statusFilter
        ? [...newFilters, { id: "status", value: statusFilter }]
        : newFilters;
    });
  }, [tab]);

  React.useEffect(() => {
    const categoryFilter = category === "all" ? undefined : category;
    setColumnFilters((filters) => {
      const newFilters = filters.filter((filter) => filter.id !== "category");
      return categoryFilter
        ? [...newFilters, { id: "category", value: categoryFilter }]
        : newFilters;
    });
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Tabs defaultValue="all" className="w-full h-full ">
      <div className="flex items-center justify-between pb-4 h-[10%]">
        <TabsList>
          <TabsTrigger onClick={() => setTab("all")} value="all">
            All
            <p className="px-1 ml-2 bg-slate-700 rounded-sm text-white">14</p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("new")} value="new">
            New
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("ongoing")} value="ongoing">
            Ongoing
            <p className="px-1 ml-2 bg-sky-500 rounded-sm text-white">11</p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("delayed")} value="delayed">
            Delayed
            <p className="px-1 ml-2 bg-red-400 rounded-sm text-white">1</p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("completed")} value="completed">
            Completed
            <p className="px-1 ml-2 bg-green-500 rounded-sm text-white">2</p>
          </TabsTrigger>
        </TabsList>
        <Button onClick={onAddTaskClick}>Add Task</Button>
      </div>

      <div className="flex items-center justify-between pb-4 h-[10%]">
        <Input
          placeholder="Filter Task Name..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center justify-end">
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
                      onCheckedChange={(value: Boolean) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-4"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto capitalize">
                {category} <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                key={"all"}
                className={`px-2 cursor-pointer capitalize ${
                  category == "all" ? "bg-slate-100" : ""
                }`}
                onClick={() => setCategory("all")}
              >
                All
              </DropdownMenuItem>
              {categories.map((ccategory) => {
                return (
                  <DropdownMenuItem
                    key={ccategory}
                    className={`px-2 cursor-pointer capitalize ${
                      category == ccategory ? "bg-slate-100" : ""
                    }`}
                    onClick={() => setCategory(ccategory)}
                  >
                    {ccategory}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-[72%]">
        <DataTable colLength={columns.length} tableData={table} />
      </div>
    </Tabs>
  );
}
