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
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import {
  MdAdd,
  MdArrowBackIos,
  MdCheckCircle,
  MdClose,
  MdCloudUpload,
  MdDescription,
  MdEdit,
  MdOutlineAttachment,
  MdOutlineCalendarMonth,
  MdOutlineDescription,
  MdOutlineFolder,
  MdOutlinePerson,
  MdOutlinePictureAsPdf,
  MdUploadFile,
} from "react-icons/md";
import { PiCaretUpDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";

interface FileWithPreview extends File {
  preview: string;
  progress: number;
}

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
  const [descEdit, setDescEdit] = useState<boolean>(false);

  const [category, setCategory] = useState<String | undefined>();
  const [desc, setDesc] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [progressOpen, setProgressOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [noProgress, setNoProgress] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
      progress: 0,
      name: file.name, // Explicitly set the file name
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          const currentFile =
            updatedFiles[prevFiles.length - newFiles.length + index];

          if (currentFile.progress >= 100) {
            clearInterval(interval);
          } else {
            currentFile.progress += 10;
          }
          return updatedFiles;
        });
      }, 500);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Accept all image types
      "application/pdf": [], // Accept PDF files
    },
    multiple: true,
  });

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleSliderChange = (value: number[]) => {
    if (task && value[0] >= task?.progress_percentageprogress) {
      setProgress(value[0]);
      console.log(value);
    }
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

        <div className="">
          <div className="w-[80%] text-slate-400 flex items-center justify-start my-6 ">
            <Dialog>
              <DialogTrigger className="w-[50%]">
                <div className="flex items-center justify-start p-2 flex-1 cursor-pointer transition-all duration-300 rounded-sm hover:bg-neutral-100">
                  <Image
                    src="/images/category.png"
                    alt="category"
                    width={24}
                    height={15}
                    className="mr-3 w-6 h-5 text-slate-600 "
                  />
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-[12px] text-neutral-500">Category</p>
                    <p className="text-[#5A74B8] font-medium">
                      {taskDetail?.category}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Category</DialogTitle>
                </DialogHeader>

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
              </DialogContent>
            </Dialog>
            <div className="flex-1"></div>
          </div>

          <div className="w-[80%] flex items-center justify-start my-6">
            <DatePickerWithRange
              className="flex-1 mr-4"
              title={"Start Date"}
              selectedDate={taskDetail?.start_date ?? ""}
            />

            <DatePickerWithRange
              className="flex-1 mr-4"
              title={"End Date"}
              selectedDate={taskDetail?.end_date ?? ""}
            />
          </div>

          <div className="w-[90%] flex items-center justify-start my-8">
            <Image
              src="/images/assignee.png"
              alt="category"
              width={24}
              height={15}
              className="mr-3 w-6 h-6 text-slate-600 m-2"
            />
            <p className="mr-8 text-[12px] text-neutral-400">Assignee</p>

            <div className="flex items-center justify-start flex-wrap gap-2">
              {taskDetail &&
                taskDetail.assignee.map((user: Assignee) => {
                  return (
                    <div
                      key={user.user_email}
                      className="mr-2 p-1 bg-neutral-100 rounded-sm flex items-center"
                    >
                      <img
                        src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                        className="h-6 w-6 rounded-full"
                      />
                      <p className="text-black text-sm mx-2">
                        {user.user_name}
                      </p>
                      <MdClose
                        onClick={() => {
                          var assigneeData = {
                            task_id: taskDetail?.id,
                            user_id: [user.user_email],
                          };

                          dispatch(removeAssignee(assigneeData));
                        }}
                        className="text-red-500 text-xl cursor-pointer"
                      />
                    </div>
                  );
                })}
              <Dialog>
                <DialogTrigger>
                  <MdAdd className="text-green-600 bg-neutral-100 text-3xl p-1 rounded-full" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Assignees</DialogTitle>

                    <div className="h-[30vh] w-full pr-2 overflow-y-auto">
                      {assignees.map((assignee) => {
                        return (
                          <Card
                            onClick={() => {
                              var assigneeData = {
                                task_id: taskDetail?.id,
                                user_id: [assignee.id],
                              };

                              console.log(assigneeData);

                              dispatch(addAssigneeToTask(assigneeData));
                            }}
                            key={assignee.id}
                            className="w-full px-2 py-2 mb-2 cursor-pointer"
                          >
                            <div className="w-full flex items-center justify-between">
                              {assignee.full_name}
                              <MdCheckCircle className="text-2xl text-slate-200" />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center justify-start my-4 m-2">
            <Image
              src="/images/desc.png"
              alt="category"
              width={24}
              height={15}
              className="mr-3 w-5 h-3 text-slate-600 "
            />

            <p className="mr-8 text-neutral-400 text-[12px]">Description</p>
          </div>

          {descEdit && (
            <div className="flex flex-col items-start justify-start w-[70%] mb-6">
              <Textarea
                placeholder="Add Description here"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full mb-3"
              />

              <div className="flex items-center justify-start w-[50%]">
                <Button
                  onClick={() => {
                    dispatch(
                      updateTask({
                        task_id: taskDetail?.id,
                        data: {
                          description: desc,
                        },
                      })
                    );
                    setDescEdit(false);
                  }}
                  className="bg-green-600 px-8 mr-3 transition-all duration-300 hover:bg-green-500 w-[50%]"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setDescEdit(false)}
                  className="border-[#143F8C] border-2 transition-all duration-300 bg-transparent hover:bg-transparent text-[#143F8C] px-8 w-[50%]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!descEdit && (
            <p
              onClick={() => setDescEdit(true)}
              className={`w-[70%] text-sm mb-6 ml-2 ${
                desc.length > 0 ? "text-slate-800" : "text-neutral-400"
              }`}
            >
              {desc.length > 0 ? desc : "Add Description here"}
            </p>
          )}

          <div className="flex items-center justify-between w-[70%]">
            <div className=" flex items-center justify-start my-4">
              <MdOutlineAttachment className="mr-2" />
              <p className="mr-8">Attachments</p>
            </div>

            <p className="text-[#5A74B8] text-sm font-semibold">View All</p>
          </div>

          <div className="flex items-center justify-start w-[70%] flex-wrap gap-2 overflow-x-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <MdAdd className="text-green-600 bg-neutral-100 text-[60px] p-2 rounded-md" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <div className="my-4">
                  <form onSubmit={uploadFiles}>
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed bg-slate-50 border-slate-500 text-center rounded-md cursor-pointer h-40 flex items-center justify-center"
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the files here ...</p>
                      ) : (
                        <div className="flex items-center justify-center flex-col">
                          <MdCloudUpload className="text-[80px] mb-2 text-slate-300" />
                          <p>Drag & drop files or Browse</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
                      {files.map((file, index) => (
                        <div key={index} className="mb-8">
                          <div className="flex items-center justify-between">
                            <div className="w-[90%]">
                              <strong>{file.name}</strong>
                              <div className="h-[6px] w-full bg-gray-300 rounded mt-1">
                                <div
                                  className={`h-full mt-2 rounded ${
                                    file.progress === 100
                                      ? "bg-green-600"
                                      : "bg-[#143F8C]"
                                  }`}
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                            </div>

                            <IoMdCloseCircle
                              onClick={() => removeFile(file.name)}
                              className="text-2xl cursor-pointer text-neutral-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      disabled={files.length == 0}
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-500"
                    >
                      Upload File
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>

            {taskDocs?.map((doc) => {
              return (
                <div
                  onClick={() => {
                    openPdfFromUrl(doc.file_url_with_protocol);
                  }}
                  key={doc.id}
                  className="py-2 px-3 w-max h-[60px] bg-neutral-100 rounded-sm cursor-pointer flex items-center"
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
          <div className="h-[300px] pt-2 overflow-y-auto ">
            {taskDetail?.timeline?.map((doc) => {
              return (
                <div className="flex items-center justify-start shadow-lg rounded-md p-4 mx-2 mb-3">
                  <Image
                    src="/images/timeline.png"
                    alt="category"
                    width={24}
                    height={15}
                    className="mr-3 w-7 h-7 text-slate-600 "
                  />
                  <div key={doc.task_update_id} className="">
                    <p className="text-sm">{doc.title}</p>
                    <div className="text-sm text-neutral-300 flex items-center justify-between">
                      <p>{formatDate(doc.date)}</p>
                      <p>{doc.updated_by}</p>
                    </div>
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
                    <p
                      onClick={() => setNoProgress(false)}
                      className={`px-4 py-2 cursor-pointer ${
                        !noProgress ? "bg-green-600 text-white" : "text-black"
                      } `}
                    >
                      Update Progress
                    </p>
                    <p
                      onClick={() => setNoProgress(true)}
                      className={`px-4 py-2 cursor-pointer ${
                        noProgress ? "bg-green-600 text-white" : "text-black"
                      } `}
                    >
                      No Progress Today
                    </p>
                  </div>

                  <div className="flex items-start justify-start my-4">
                    <p className="mt-3 text-sm w-[25%]">Estimated</p>
                    <p className="mt-3 text-sm">
                      {taskDetail?.task_progress}/{taskDetail?.estimated_work}{" "}
                      {taskDetail?.unit}
                    </p>
                  </div>

                  {!noProgress && (
                    <div className="flex items-start justify-start my-4">
                      <p className="mt-3 text-sm w-[25%]">Work Progress</p>

                      {taskDetail?.unit === "Percentage" ? (
                        <Slider
                          color="#37AD4A"
                          className="mt-4 w-[60%]"
                          onValueChange={handleSliderChange}
                          value={[progress]}
                          min={0}
                          max={100}
                          step={1}
                        />
                      ) : (
                        <div className="w-[75%] flex flex-col items-start justify-between">
                          <div className="flex items-center justify-start mt-3 border-b-2 border-neutral-400 w-[60%] pb-1">
                            <input
                              placeholder="Ex. 100"
                              type="number"
                              max={taskDetail?.estimated_work}
                              min={0}
                              onChange={(e) => {}}
                              className="text-sm  w-[60%] border-none outline-none"
                            />
                            <p className="text-sm">{taskDetail?.unit}</p>
                          </div>
                        </div>
                      )}

                      {taskDetail?.unit === "Percentage" && (
                        <p className="mt-3 text-sm">{progress}/100%</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-start justify-between my-8">
                    <p className="mt-1 text-sm w-[25%]">Remarks</p>

                    <Textarea
                      placeholder="Add Remarks here"
                      rows={3}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="w-[75%] mb-6"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      var taskData = {
                        task_id: taskDetail?.id,
                        progress: progress,
                        remarks: remark,
                      };

                      dispatch(updateTaskProgress(taskData));
                      setOpen(false);
                    }}
                    className="w-full bg-green-600 my-6"
                  >
                    Update
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
