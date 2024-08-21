"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { flexRender, Table as RTable } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MdArrowDownward } from "react-icons/md";

interface TableProps {
  tableData: RTable<any>;
  colLength: number;
}

export default function DataTable({ tableData, colLength }: TableProps) {
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <div className="h-full">
      <div className="h-[90%] overflow-y-auto shadow-md rounded-md border">
        <Table className="h-full">
          <TableHeader>
            {tableData.getHeaderGroups().map((headerGroup) => (
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableData.getRowModel().rows?.length ? (
              tableData.getRowModel().rows.map((row) => (
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
                <TableCell colSpan={colLength} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="h-[10%] flex items-center justify-end space-x-2 py-4">
        <div className="ml-4">
          <label htmlFor="pageSize" className="mr-2">
            Rows per page:
          </label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {pageSize} <MdArrowDownward className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              {[5, 10, 15, 20].map((size) => (
                <DropdownMenuItem
                  className={`px-2 cursor-pointer ${size == pageSize ? 'bg-slate-100' : ''}`}
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    console.log(size);
                    tableData.setPageSize(size);
                  }}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => tableData.previousPage()}
          disabled={!tableData.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => tableData.nextPage()}
          disabled={!tableData.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
