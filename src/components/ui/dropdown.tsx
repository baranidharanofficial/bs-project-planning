"use client"

import * as React from "react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { MdArrowDownward } from "react-icons/md"


interface ProgressProps {
    selected: String;
  }

export function PogressDropdown({selected}: ProgressProps) {
  const [selectedValue, setSelectedValue] = useState<String>("");

  useEffect(() => {
    setSelectedValue(selected);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedValue} <MdArrowDownward className="ml-2"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuItem className="p-2" onClick={() => setSelectedValue("In progress")}>
            In progress
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2" onClick={() => setSelectedValue("Ongoing")}>
            Ongoing
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2" onClick={() => setSelectedValue("Delayed")}>
            Delayed
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2" onClick={() => setSelectedValue("Completed")}>
            Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
