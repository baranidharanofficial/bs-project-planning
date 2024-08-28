"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdEdit } from "react-icons/md";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "@/state/task/taskSlice";
import { formatDate2 } from "../custom/date-format";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const taskDetail = useSelector(
    (state: RootState) => state.task.currentTaskDetails
  );

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (taskDetail && taskDetail?.start_date) {
      const dateObject = new Date(taskDetail.start_date);
      const dateObject2 = new Date(taskDetail.end_date);

      setDate({
        from: dateObject,
        to: dateObject2,
      });
    }
  }, [taskDetail]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"ghost"}
            className={cn(
              "w-max justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <MdEdit />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => {
              setDate(date);
              if (date && date?.from && date?.to && taskDetail) {
                dispatch(
                  updateTask({
                    task_id: taskDetail?.id,
                    data: {
                      exp_start_date: formatDate2(date?.from),
                      exp_end_date: formatDate2(date?.to),
                    },
                  })
                );
                setPopoverOpen(false); // Close the calendar after selection
              }
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
