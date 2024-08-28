"use client";

import { formatDate } from "@/components/custom/date-format";
import { RadialChart } from "@/components/custom/gauge-chart";
import { TaskCarousel } from "@/components/custom/task-carousel";
import { Assignee } from "@/components/custom/task-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AppDispatch, RootState, store } from "@/state/store";
import {
  addAssigneeToTask,
  addAttachments,
  getAssignees,
  removeAssignee,
  setTaskDetails,
  updateTask,
  updateTaskProgress,
} from "@/state/task/taskSlice";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  MdAdd,
  MdArrowBackIos,
  MdCheckCircle,
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
import { useDispatch, useSelector } from "react-redux";

export default function TaskDetails() {
  const taskDetail = useSelector(
    (state: RootState) => state.task.currentTaskDetails
  );
  const taskDocs = useSelector((state: RootState) => state.task.documents);
  const taskImages = useSelector((state: RootState) => state.task.photos);
  const task = useSelector((state: RootState) => state.task.currentTask);
  const categories = useSelector((state: RootState) => state.task.categories);
  const assignees = useSelector((state: RootState) => state.task.assignees);

  const [remark, setRemark] = useState<string>("");

  

  const [category, setCategory] = useState<String | undefined>();
  const [desc, setDesc] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [progressOpen, setProgressOpen] = useState(false);

  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch<AppDispatch>();


  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
    console.log(value);
  };

  useEffect(() => {
    setCategory(taskDetail?.category);
    setDesc(taskDetail?.description ?? "");
    setProgress(task?.progress_percentageprogress ?? 0);
    dispatch(getAssignees());
  }, []);

  function openPdfFromUrl(url: string): void {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      console.error("No URL provided to open PDF");
    }
  }

  const uploadFiles = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.querySelector<HTMLInputElement>("#fileInput");

    if (fileInput && fileInput.files) {
      formData.append("documenttype", "Task");
      formData.append("docname", taskDetail?.id ?? "");
      formData.append("file1", fileInput.files[0]);
      formData.append("file2", fileInput.files[0]);

      dispatch(addAttachments(formData));

      setOpen(false);
    }
  };

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
            <p className="text-black font-medium">{taskDetail?.category}</p>

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
                      <Button
                        variant="outline"
                        className="ml-auto capitalize w-full mt-4"
                      >
                        {category} <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {categories.map((ccategory) => {
                        return (
                          <DropdownMenuItem
                            key={ccategory.name}
                            className={`px-2 cursor-pointer capitalize w-full ${
                              category == ccategory.name ? "bg-slate-100" : ""
                            }`}
                            onClick={() => setCategory(ccategory.name)}
                          >
                            {ccategory.name}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <SheetClose>
                    <Button
                      onClick={() =>
                        dispatch(
                          updateTask({
                            task_id: "TASK-2024-00004",
                            data: {
                              category: category,
                            },
                          })
                        )
                      }
                      className="bg-green-600 mt-4 w-full"
                    >
                      Update
                    </Button>
                  </SheetClose>
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

            <div className="flex items-center justify-start overflow-x-auto">
              <Sheet>
                <SheetTrigger>
                  <MdAdd className="text-green-600 bg-neutral-100 text-4xl p-1 rounded-full" />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Update Assignees</SheetTitle>

                    <div className="h-[90vh] w-full pr-2 overflow-y-auto">
                      {
                        assignees.map((assignee) => {
                          return <Card onClick={() => {
                            var assigneeData = {
                              "task_id": taskDetail?.id,
                              "user_id": [assignee.id],
                            };
                            
                            console.log(assigneeData);

                            dispatch(addAssigneeToTask(assigneeData));

                          }} key={assignee.id} className="w-full px-2 py-2 mb-2 cursor-pointer">
                            
                            <div className="w-full flex items-center justify-between">
                            {assignee.full_name}
                            <MdCheckCircle className="text-2xl text-slate-200"/>
                            </div>
                          </Card>
                        })
                      }
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              {taskDetail &&
                taskDetail.assignee.map((user: Assignee) => {
                  return (
                    <div
                      key={user.user_email}
                      className="ml-4 p-2 bg-neutral-100 rounded-sm flex items-center"
                    >
                      <img
                        src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                        className="h-6 w-6 rounded-full"
                      />
                      <p className="text-black mx-2">{user.user_name}</p>
                      <MdClose
                        onClick={() => {
                          var assigneeData = {
                            task_id: taskDetail?.id,
                            user_id: [user.user_email],
                          };

                          dispatch(removeAssignee(assigneeData));
                        }}
                        className="text-red-500 text-2xl cursor-pointer"
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="text-slate-400 flex items-center justify-start my-4">
            <MdOutlineDescription className="mr-2" />
            <p className="mr-8 text-[12px]">Description</p>

            <Sheet>
              <SheetTrigger>
                <MdEdit />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Update Description</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col items-center justify-start">
                  <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    type="text"
                    placeholder="Description"
                  />

                  <Button
                    onClick={() =>
                      dispatch(
                        updateTask({
                          task_id: taskDetail?.id,
                          data: {
                            description: desc,
                          },
                        })
                      )
                    }
                    className="bg-green-600 mt-4 w-full"
                  >
                    <SheetClose>Update</SheetClose>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Textarea
            placeholder="Add Description here"
            rows={6}
            value={taskDetail?.description}
            readOnly={true}
            className="w-[500px] mb-6"
          />

          <div className="flex items-center justify-between w-[500px]">
            <div className=" flex items-center justify-start my-4">
              <MdOutlineAttachment className="mr-2" />
              <p className="mr-8">Attachments</p>
            </div>

            <p className="text-blue-700 text-sm font-semibold">View All</p>
          </div>

          <div className="flex items-center justify-start w-[500px] overflow-x-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <MdAdd className="text-green-600 bg-neutral-100 text-[60px] p-2 rounded-md" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <form onSubmit={uploadFiles}>
                    <Input type="file" id="fileInput" accept=".pdf" multiple />

                    <Button type="submit" className="w-full bg-green-600">
                      Upload File
                    </Button>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {taskDocs?.map((doc) => {
              return (
                <div
                  onClick={() => {
                    openPdfFromUrl(doc.file_url_with_protocol);
                  }}
                  key={doc.id}
                  className="ml-4 py-2 px-3 min-w-[280px] h-[60px] bg-neutral-100 rounded-sm cursor-pointer flex items-center my-2"
                >
                  <MdOutlinePictureAsPdf className="text-red-500 text-4xl w-[10%]" />

                  <div className="w-[90%]">
                    <p className="text-black text-sm mx-2 whitespace-nowrap overflow-hidden">
                      {doc.filename ?? 1}.pdf
                    </p>
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
              <RadialChart
                progress={{
                  completed: task?.progress_percentageprogress ?? 0,
                  remaining: task?.progress_percentageprogress
                    ? 100 - task?.progress_percentageprogress
                    : 100,
                }}
              />
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex items-center justify-between mb-2 mx-2">
            <p>Images</p>
            <p className="text-sm text-blue-700 font-semibold">View All</p>
          </div>
          {taskImages.length > 0 && (
            <div className="flex items-center justify-start gap-3 w-full overflow-x-auto h-[100px] mx-2">
              {taskImages.map((doc) => {
                return (
                  <Dialog>
                    <DialogTrigger>
                      <img
                        key={doc.id}
                        src={doc.file_url_with_protocol}
                        className="h-[100px] w-[100px] object-cover"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Task Images</DialogTitle>
                        <TaskCarousel images={taskImages} />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          )}

          {taskImages.length == 0 && (
            <div className="w-full h-[100px] flex text-neutral-300 items-center justify-center">
              <p>No Images uploaded yet</p>
            </div>
          )}
        </div>
        <div className="py-4">
          <div className="flex items-center justify-between my-2 mx-2">
            <p>Timeline</p>
            <p className="text-sm text-blue-700 font-semibold">View All</p>
          </div>
          <div className="h-[300px] pt-2 overflow-y-auto">
            {taskDetail?.timeline?.map((doc) => {
              return (
                <div
                  key={doc.task_update_id}
                  className="shadow-lg rounded-md p-4 mx-2 mb-3"
                >
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
        
        <div className="w-full">
          <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
            <DialogTrigger className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-500">
                Update Task Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-6">Update Task Progress</DialogTitle>

                <div>
                  <div className="flex items-center justify-between w-max border-2 rounded-sm border-green-600">
                    <p className="px-4 py-2 cursor-pointer bg-green-600 text-white">Update Progress</p>
                    <p className="px-4 py-2 cursor-pointer">No Progress Today</p>
                  </div>
                 

                  <div className="flex items-center justify-between my-4">
                    <p  className="mt-3 text-sm w-[25%]">Work Progress</p>
                    <Slider color="#37AD4A" className="mt-4 w-[60%]" onValueChange={handleSliderChange} defaultValue={[task?.progress_percentageprogress ?? 0]} min={0} max={100} step={1} />
                    <p className="mt-3 text-sm">{progress}/100%</p>
                  </div>

                  <div className="flex items-start justify-between my-8">
                    <p  className="mt-1 text-sm w-[25%]">Remarks</p>
                   
                    <Textarea
                      placeholder="Add Remarks here"
                      rows={3}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="w-[75%] mb-6"
                    />
                  </div>
                
                <Button onClick={() => {
                  var taskData = {
                    "task_id": taskDetail?.id,
                    "progress": progress,
                    "remarks": remark,
                  };

                  dispatch(updateTaskProgress(taskData));
                  setOpen(false);
                }} className="w-full bg-green-600 my-6">Update</Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        
      </div>
    </div>
  );
}
