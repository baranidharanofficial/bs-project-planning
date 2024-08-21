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
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import {  RiBuilding2Line } from "react-icons/ri";
import { Progress } from "../ui/progress";
import { formatDate } from "./date-format";
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

const createColumns = (onTaskClick: (taskName: string) => void): ColumnDef<Task>[] => [

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
            )
        },
        cell: ({ row }) => {
          const category = row.original.category;
        return          (
          
            <div className="capitalize ml-4 cursor-pointer flex items-center" onClick={() => {
              // onTaskClick(row.getValue("title"));
              console.log(row.getValue("category"));
            }}>
                <div className="bg-green-50 border-green-300 border-[1px] rounded-md p-2 mr-2">
                    <RiBuilding2Line className="text-4xl text-green-700 dark:text-white " />
                </div>
                <div>
                    <p className="text-md font-semibold mb-1  hover:underline">{row.getValue("title")}</p>
                    <p className="!text-[8px] text-slate-400">{category}</p>
                </div>
            </div>
        )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div onClick={() => {
              onTaskClick(row.getValue("title"));
            }} className={`capitalize w-max px-2 py-1 rounded-sm ${row.getValue("status") !== "Delayed" ? "bg-green-200" : "bg-red-200"}`} >
                {row.getValue("status")}
            </div>
        ),
    },
    {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => (
            <div  onClick={() => {
              onTaskClick(row.getValue("title"));
            }} >
                <Progress className="h-2 bg-green-100 w-[80%] mb-1" indicatorColor="bg-green-500" value={parseInt(row.getValue("progress"), 10)} />
                <p className="capitalize">{String(row.getValue("progress")).split(".")[0]} %</p>
            </div>
        ),
    },
    {
        accessorKey: "expected_end_date",
        header: () => <div  className="text-left">End Date</div>,
        cell: ({ row }) => {
            return <div  onClick={() => {
              onTaskClick(row.getValue("title"));
            }} className="text-left font-medium">{formatDate(row.getValue("expected_end_date"))}</div>
        },
    },
    {
        accessorKey: "issues",
        header: () => <div className="text-left">Issues</div>,
        cell: ({ row }) => {
            return <div onClick={() => {
              onTaskClick(row.getValue("title"));
            }} className="text-left font-medium">2</div>
        },
    },
];

type DataTableDemoProps = {
    tasks: Task[],
    onTaskClick: (projectName: string) => void;
    onAddTaskClick: () => void;
};

export function TaskTable({ onTaskClick, onAddTaskClick, tasks }: DataTableDemoProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null);

    const [tab, setTab] = React.useState("all");

    const columns = React.useMemo(() => createColumns(onTaskClick), [onTaskClick]);

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
        const statusFilter = tab === "all" ? undefined : tab.charAt(0).toUpperCase() + tab.slice(1);
        setColumnFilters((filters) => {
            const newFilters = filters.filter((filter) => filter.id !== "status");
            return statusFilter ? [...newFilters, { id: "status", value: statusFilter }] : newFilters;
        });
    }, [tab]);
    
    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <Tabs defaultValue="all" className="w-full h-full ">
            <div className="flex items-center justify-between pb-4 h-[10%]">
                <TabsList>
                    <TabsTrigger onClick={() => setTab("all")} value="all">
                        All
                        <p className="px-1 ml-2 bg-slate-700 rounded-sm text-white" >14</p>
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setTab("new")} value="new">New</TabsTrigger>
                    <TabsTrigger onClick={() => setTab("ongoing")} value="ongoing">
                        Ongoing
                        <p className="px-1 ml-2 bg-sky-500 rounded-sm text-white" >11</p>
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setTab("delayed")} value="delayed">
                        Delayed
                        <p className="px-1 ml-2 bg-red-400 rounded-sm text-white" >1</p>
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setTab("completed")} value="completed">
                        Completed
                        <p className="px-1 ml-2 bg-green-500 rounded-sm text-white" >2</p>
                    </TabsTrigger>
                </TabsList>
                <Button onClick={onAddTaskClick}>Add Task</Button>
            </div>

            <div className="flex items-center pb-4 h-[10%]">
                <Input
                    placeholder="Filter Task Name..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
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
                                        onCheckedChange={(value: Boolean) =>
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

            <div className="h-[80%]">
                 <DataTable colLength={columns.length} tableData={table} />   
            </div>
        </Tabs>
    )
}
