"use client";

import { formatDate } from "@/components/custom/date-format";
import { RadialChart } from "@/components/custom/gauge-chart";
import { Assignee } from "@/components/custom/task-table";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PogressDropdown } from "@/components/ui/dropdown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { RootState, store } from "@/state/store";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  MdAdd,
  MdArrowBackIos,
  MdClose,
  MdDescription,
  MdEdit,
  MdOutlineAttachment,
  MdOutlineCalendarMonth,
  MdOutlineDescription,
  MdOutlineFolder,
  MdOutlinePerson,
  MdOutlinePictureAsPdf,
} from "react-icons/md";
import { PiCaretUpDownBold } from "react-icons/pi";
import { useSelector } from "react-redux";

export default function TaskDetails() {
  const taskDetail = useSelector(
    (state: RootState) => state.task.currentTaskDetails
  );
  const taskDocs = useSelector((state: RootState) => state.task.documents);
  const taskImages = useSelector((state: RootState) => state.task.photos);
  const task = useSelector((state: RootState) => state.task.currentTask);
  const categories = useSelector((state: RootState) => state.task.categories);

  const [category, setCategory] = React.useState<String | undefined>();

  useEffect(() => {
    setCategory(taskDetail?.category);
  }, [])

  return (
    <div className="bg-neutral-100 h-full w-full flex items-center rounded-sm justify-between">
      <div className="bg-white h-full w-[65%] p-6">
        <p className="text-[12px] text-slate-400 mb-6">
          Home / Projects / Tasks / {task?.title}
        </p>
        <div className="flex items-center justify-start text-xl font-semibold mb-4">
          <Link href="/dashboard/tasks">
            <MdArrowBackIos className="mr-2" />
          </Link>
          <p className="mr-2">{task?.title}</p>
          <PiCaretUpDownBold />
        </div>

        <div className="ml-8">
          <div className="text-slate-400 flex items-center justify-start my-6">
            <MdOutlineFolder className="mr-2" />
            <p className="mr-8 text-[12px]">Category</p>
            <p className="text-black font-medium">{task?.category}</p>

            <Sheet>
              <SheetTrigger>
                <MdEdit />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Update Category</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col items-center justify-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto capitalize w-full mt-4">
                        {category} <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {categories.map((ccategory) => {
                        return (
                          <DropdownMenuItem
                            key={ccategory}
                            className={`px-2 cursor-pointer capitalize w-full ${category == ccategory ? "bg-slate-100" : ""
                              }`}
                            onClick={() => setCategory(ccategory)}
                          >
                            {ccategory}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>


                  <Button className="bg-green-600 mt-4 w-full">Update</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="text-slate-400 flex items-center justify-start my-6">
            <MdOutlineCalendarMonth className="mr-2" />
            <p className="mr-6 text-[12px]">Start Date</p>
            <p className="text-black font-medium">
              {formatDate(taskDetail?.start_date)}
            </p>
            <DatePickerWithRange />
          </div>
          <div className="text-slate-400 flex items-center justify-start my-6">
            <MdOutlineCalendarMonth className="mr-2" />
            <p className="mr-8 text-[12px]">End Date</p>
            <p className="text-black font-medium">
              {formatDate(taskDetail?.end_date)}
            </p>
            <DatePickerWithRange />
          </div>
          <div className="text-slate-400 flex items-center justify-start my-6">
            <MdOutlinePerson className="mr-2" />
            <p className="mr-8 text-[12px]">Assignee</p>

            <div className="flex items-center justify-start">
              <Sheet>
                <SheetTrigger>
                  <MdAdd className="text-green-600 bg-neutral-100 text-4xl p-1 rounded-full" />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Update Assignees</SheetTitle>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              {taskDetail?.assignee.map((user: Assignee) => {
                return (
                  <div className="ml-4 p-2 bg-neutral-100 rounded-sm flex items-center">
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                      className="h-6 w-6 rounded-full"
                    />
                    <p className="text-black mx-2">{user.user_name}</p>
                    <MdClose className="text-red-500 text-2xl cursor-pointer" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-slate-400 flex items-center justify-start my-4">
            <MdOutlineDescription className="mr-2" />
            <p className="mr-8 text-[12px]">Description</p>
          </div>

          <Textarea
            placeholder="Add Description here"
            rows={6}
            value={taskDetail?.description}
            className="w-[500px] mb-6"
          />

          <div className="flex items-center justify-between w-[500px]">
            <div className=" flex items-center justify-start my-4">
              <MdOutlineAttachment className="mr-2" />
              <p className="mr-8">Attachments</p>
            </div>

            <p className="text-blue-700 text-sm font-semibold">View All</p>
          </div>

          <div className="flex items-center justify-start">
            <Dialog>
              <DialogTrigger>
                <MdAdd className="text-green-600 bg-neutral-100 text-[60px] p-2 rounded-md" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <Input type="file" />
                  <Button className="w-full bg-green-600">Upload File</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {taskDocs?.map((doc) => {
              return (
                <div className="ml-4 py-2 px-3 bg-neutral-100 rounded-sm flex items-center">
                  <MdOutlinePictureAsPdf className="text-red-500 text-4xl" />

                  <div>
                    <p className="text-black mx-2">{doc.filename ?? 1}.pdf</p>
                    <p className="text-neutral-400 text-sm mx-2">PDF</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-white h-full w-[34%] p-3">
        <div className="w-full h-[220px] border-solid border-2 border-neutral-100 rounded-md p-4">
          <div className="mb-3 px-1">
            <div className="flex items-center justify-between border-b-2 border-solid border-neutral-100 pb-4 mb-4">
              <p>Status</p>
              <PogressDropdown selected={task?.status || "In Progress"} />
            </div>

            <div className="">
              <RadialChart progress={{ completed: 75, remaining: 25 }} />
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex items-center justify-between mb-2 mx-2">
            <p>Images</p>
            <p className="text-sm text-blue-700 font-semibold">View All</p>
          </div>
          <div className="flex items-center justify-start gap-3 w-full overflow-x-auto h-[100px] mx-2">
            {taskImages.map((doc) => {
              return (
                <img
                  src={doc.file_url_with_protocol}
                  className="h-[100px] w-[100px] object-cover"
                />
              );
            })}
          </div>
        </div>
        <div className="py-4">
          <div className="flex items-center justify-between my-2 mx-2">
            <p>Timeline</p>
            <p className="text-sm text-blue-700 font-semibold">View All</p>
          </div>
          <div className="h-[300px] pt-2 overflow-y-auto">
            {taskDetail?.timeline?.map((doc) => {
              return (
                <div className="shadow-lg rounded-md p-4 mx-2 mb-3">
                  <p className="text-sm">{doc.title}</p>
                  <div className="text-sm text-neutral-300 flex items-center justify-between">
                    <p>{formatDate(doc.date)}</p>
                    <p>{doc.updated_by}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button className="mx-2 w-[400px] bg-green-600 hover:bg-green-500">
              Update Progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>

              <Button className="w-full bg-green-600">Update</Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
