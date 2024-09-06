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
  setUnits,
  TaskUnit,
  updateTask,
  updateTaskProgress,
} from "@/state/task/taskSlice";
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
  MdScale,
  MdSearch,
  MdUploadFile,
} from "react-icons/md";
import { PiCaretUpDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";

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
  const units = useSelector((state: RootState) => state.task.units);
  const assignees = useSelector((state: RootState) => state.task.assignees);

  const [remark, setRemark] = useState<string>("");
  const [descEdit, setDescEdit] = useState<boolean>(false);

  const [category, setCategory] = useState<String | undefined>();
  const [selectedUnit, setSelectedUnit] = useState<TaskUnit | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [estimatedWork, setEstimatedWork] = useState(0);

  const [desc, setDesc] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [progressOpen, setProgressOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [noProgress, setNoProgress] = useState(false);
  const [image, setImage] = useState(false);

  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();

  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const [rawfiles, setRawFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      setRawFiles([...rawfiles, file]);
    });

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
    if (task && value[0] >= task?.progress_percentage) {
      setProgress(value[0]);
      console.log(value);
    }
  };

  const filteredCategories = categories.filter((ccategory) =>
    ccategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssignees = assignees.filter((assignee) =>
    assignee.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCategory(taskDetail?.category);
    setDesc(taskDetail?.description ?? "");
    setProgress(task?.progress_percentage ?? 0);
    dispatch(getAssignees());
    console.log("RERENDER TEST");
  }, [taskDetail]);

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

      rawfiles.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
      });

      dispatch(addAttachments(formData));

      setRawFiles([]);
      setFiles([]);
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
          {/* <PiCaretUpDownBold /> */}
        </div>

        <div className="">
          <div className="w-[80%] text-slate-400 flex items-center justify-start my-6 ">
            <Dialog>
              <DialogTrigger className="w-[50%]">
                <div className="flex items-center justify-start p-2 flex-1 cursor-pointer transition-all duration-300 rounded-sm hover:bg-neutral-100">
                  <Image
                    src="/images/category.png"
                    alt="category"
                    width={16}
                    height={16}
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

                <div className="w-full h-[400px] ">
                  <div className="h-[52px] my-2 px-3 border-2 border-neutral-200 w-full rounded-md flex items-center justify-start">
                    <MdSearch className="text-2xl text-neutral-400 mr-3" />
                    <input
                      placeholder="Search Category"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-none outline-none w-[90%]"
                    />
                  </div>
                  <div className="h-[330px] pr-2 overflow-y-auto">
                    {filteredCategories.map((ccategory) => {
                      return (
                        <Card
                          className={`w-full cursor-pointer px-3 py-2 mb-2 ${
                            category == ccategory.name
                              ? "border-green-600 "
                              : ""
                          }`}
                          key={ccategory.name}
                          onClick={() => {
                            setCategory(ccategory.name);
                          }}
                        >
                          <div className="w-full flex items-center justify-between capitalize">
                            <p>{ccategory.name}</p>
                            <MdCheckCircle
                              className={`px-2 text-[42px] ${
                                category == ccategory.name
                                  ? "text-green-600 "
                                  : "text-slate-300"
                              }`}
                            />
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                <DialogClose className="w-full">
                  <Button
                    onClick={() => {
                      dispatch(
                        updateTask({
                          task_id: taskDetail?.id,
                          data: {
                            category: category,
                          },
                        })
                      );
                      toast({
                        title: "Category Updated",
                        description: `for task ${taskDetail?.id}`,
                      });
                    }}
                    className="bg-green-600 mt-2 w-full"
                  >
                    Update
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className="w-[50%]">
                <div className="flex items-center justify-start p-2 flex-1 cursor-pointer transition-all duration-300 rounded-sm hover:bg-neutral-100">
                  <MdScale className="mr-3 w-6 h-5 text-slate-600 " />
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-[12px] text-neutral-500">Unit</p>
                    <p className="text-[#5A74B8] font-medium">
                      {selectedUnit != null
                        ? selectedUnit?.name
                        : taskDetail?.unit}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Unit</DialogTitle>
                </DialogHeader>

                {taskDetail?.unit_change_limit_reached ? (
                  <div>
                    <p>Unit Change Limit is Reached</p>
                  </div>
                ) : (
                  <div className="w-full h-[400px] ">
                    <div className="h-[52px] my-2 px-3 border-2 border-neutral-200 w-full rounded-md flex items-center justify-start">
                      <MdSearch className="text-2xl text-neutral-400 mr-3" />
                      <input
                        placeholder="Search Unit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-none outline-none w-[90%]"
                      />
                    </div>
                    <div className="h-[280px] pr-2 overflow-y-auto">
                      {filteredUnits.map((unit: TaskUnit) => {
                        return (
                          <Card
                            className={`w-full cursor-pointer px-3 py-2 mb-2 ${
                              selectedUnit != null &&
                              selectedUnit.name == unit.name
                                ? "border-green-600 "
                                : ""
                            }`}
                            key={unit.name}
                            onClick={() => {
                              setSelectedUnit(unit);
                            }}
                          >
                            <div className="w-full flex items-center justify-between">
                              <p>
                                {unit.name} ( {unit.symbol} )
                              </p>
                              <MdCheckCircle
                                className={`px-2 text-[42px] ${
                                  selectedUnit != null &&
                                  selectedUnit.name == unit.name
                                    ? "text-green-600 "
                                    : "text-slate-300"
                                }`}
                              />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                    {selectedUnit != null &&
                      selectedUnit.name != "Percentage" && (
                        <div className="h-[52px] my-2 px-3 border-2 border-neutral-200 w-full rounded-md flex items-center justify-start">
                          <input
                            placeholder="Estimated Work"
                            value={estimatedWork}
                            type="number"
                            onChange={(e) =>
                              setEstimatedWork(parseInt(e.target.value))
                            }
                            className="border-none outline-none w-full"
                          />
                        </div>
                      )}
                  </div>
                )}
                <DialogClose className="w-full">
                  <Button
                    onClick={() => {
                      if (!taskDetail?.unit_change_limit_reached) {
                        if (estimatedWork > 0) {
                          dispatch(
                            updateTask({
                              task_id: taskDetail?.id,
                              data: {
                                unit: selectedUnit?.name,
                                estimated_work: estimatedWork,
                              },
                            })
                          );
                        } else {
                          dispatch(
                            updateTask({
                              task_id: taskDetail?.id,
                              data: {
                                unit: selectedUnit?.name,
                              },
                            })
                          );
                        }

                        toast({
                          title: "Unit Updated",
                          description: `for task ${taskDetail?.id}`,
                        });
                      }
                    }}
                    className="bg-green-600 mt-2 w-full"
                  >
                    {taskDetail?.unit_change_limit_reached ? "Close" : "Update"}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
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
              width={16}
              height={16}
              className="mr-3 w-6 h-6 text-slate-600 m-2"
            />
            <div className="flex flex-col items-start justify-start ">
              <p className="mr-8 text-sm text-neutral-400 mb-2">Assignee</p>

              <div className="flex items-center justify-start flex-wrap gap-2">
                {taskDetail &&
                  taskDetail.assignee.map((user: Assignee) => {
                    return (
                      <div
                        key={user.user_email}
                        className="mr-2 p-1 bg-neutral-100 rounded-sm flex items-center"
                      >
                        <div className="text-sm bg-white h-6 w-6 rounded-full flex items-center justify-center">
                          {user.user_name.charAt(0).toUpperCase()}
                        </div>
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
                          className="text-neutral-500 font-semibold text-xl cursor-pointer"
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
                      <DialogTitle>Task Assignee</DialogTitle>
                    </DialogHeader>
                    <div className="h-[400px]">
                      <div className="h-[52px] my-2 px-3 border-2 border-neutral-200 w-full rounded-md flex items-center justify-start">
                        <MdSearch className="text-2xl text-neutral-400 mr-3" />
                        <input
                          placeholder="Search Assignee"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="border-none outline-none w-[90%]"
                        />
                      </div>
                      <div className="h-[300px] w-full pr-2 overflow-y-auto">
                        {filteredAssignees.map((assignee) => {
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
                              className="w-full px-2 py-4 mb-2 cursor-pointer"
                            >
                              <div className="w-full flex items-center justify-between">
                                {assignee.full_name}
                                <MdCheckCircle className="text-2xl text-slate-200" />
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
            <div className="flex items-center justify-start my-4">
              <MdOutlineAttachment className="mx-2" />
              <p className="ml-1 text-neutral-400 text-[12px]">Attachments</p>
            </div>

            <Sheet>
              <SheetTrigger>
                <p
                  onClick={() => setImage(false)}
                  className="text-[#5A74B8] text-sm font-semibold cursor-pointer"
                >
                  View All
                </p>
              </SheetTrigger>
              <SheetContent className="w-[50vw] min-w-[50vw]">
                <SheetHeader className="w-full">
                  <SheetTitle>Attachments</SheetTitle>
                </SheetHeader>
                <div className="w-full bg-white mt-4">
                  <div className="flex items-center justify-between mb-6 w-max border-2 rounded-sm border-green-600">
                    <p
                      onClick={() => setImage(true)}
                      className={`px-4 py-2 cursor-pointer ${
                        image ? "bg-green-600 text-white" : "text-black"
                      } `}
                    >
                      Images
                    </p>
                    <p
                      onClick={() => setImage(false)}
                      className={`px-4 py-2 cursor-pointer ${
                        !image ? "bg-green-600 text-white" : "text-black"
                      } `}
                    >
                      Documents
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm ">
                      {image ? taskImages.length : taskDocs.length} items
                    </p>

                    <Button>+ Add Items</Button>
                  </div>

                  <div className="grid grid-cols-5 gap-4 overflow-x-auto">
                    {image &&
                      taskImages.map((taskImage) => {
                        return (
                          <div className="aspect-square bg-slate-200">
                            <Image
                              alt="Task Image"
                              width={100}
                              height={100}
                              src={taskImage.file_url_with_protocol}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        );
                      })}

                    {!image &&
                      taskDocs.map((taskDoc) => {
                        return (
                          <div className="aspect-square bg-slate-200">
                            <Image
                              alt="Task Image"
                              width={100}
                              height={100}
                              src={taskDoc.file_url_with_protocol}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
                      <input {...getInputProps()} id="fileInput" />
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
                      {doc.filename ?? 1}
                    </p>
                    <p className="text-neutral-400 text-sm mx-2">PDF</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white h-full w-[34%] flex flex-col justify-between p-3">
        <div className="h-[90%] overflow-y-auto mb-4">
          <div className="w-full h-[240px] border-solid border-2 border-neutral-100 rounded-md p-4">
            <div className="mb-3 px-1 pb-3">
              <div className="flex items-center justify-between border-b-2 border-solid border-neutral-100 pb-4 mb-4">
                <p>Status</p>
                <PogressDropdown selected={task?.status || "In Progress"} />
              </div>

              <div className="mb-3">
                <RadialChart
                  progress={{
                    completed: task?.progress_percentage ?? 0,
                    remaining: task?.progress_percentage
                      ? 100 - task?.progress_percentage
                      : 100,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="py-4 w-full">
            <div className="flex items-center justify-between mb-2 px-2 w-full">
              <p>Images</p>
              <Sheet>
                <SheetTrigger>
                  <p
                    onClick={() => setImage(true)}
                    className="text-[#5A74B8] text-sm font-semibold cursor-pointer"
                  >
                    View All
                  </p>
                </SheetTrigger>
                <SheetContent className="w-[50vw] min-w-[50vw]">
                  <SheetHeader className="w-full">
                    <SheetTitle>Attachments</SheetTitle>
                  </SheetHeader>
                  <div className="w-full bg-white mt-4">
                    <div className="flex items-center justify-between mb-6 w-max border-2 rounded-sm border-green-600">
                      <p
                        onClick={() => setImage(true)}
                        className={`px-4 py-2 cursor-pointer ${
                          image ? "bg-green-600 text-white" : "text-black"
                        } `}
                      >
                        Images
                      </p>
                      <p
                        onClick={() => setImage(false)}
                        className={`px-4 py-2 cursor-pointer ${
                          !image ? "bg-green-600 text-white" : "text-black"
                        } `}
                      >
                        Documents
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm ">
                        {image ? taskImages.length : taskDocs.length} items
                      </p>

                      <Button>+ Add Items</Button>
                    </div>

                    <div
                      className={`grid gap-4 overflow-x-auto ${
                        image ? "grid-cols-5" : "grid-cols-4"
                      }`}
                    >
                      {image &&
                        taskImages.map((taskImage) => {
                          return (
                            <div className="aspect-square bg-slate-200">
                              <Image
                                alt="Task Image"
                                width={100}
                                height={100}
                                src={taskImage.file_url_with_protocol}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          );
                        })}

                      {!image &&
                        taskDocs.map((taskDoc) => {
                          return (
                            <div
                              onClick={() => {
                                openPdfFromUrl(taskDoc.file_url_with_protocol);
                              }}
                              className="aspect-square bg-white border-[1px]  flex flex-col items-center justify-center overflow-hidden border-neutral-200"
                            >
                              <Image
                                alt="photo"
                                width={100}
                                height={100}
                                key={taskDoc.id}
                                src="/images/file.png"
                                className="h-[100px] min-w-[100px] object-cover cursor-pointer"
                              />
                              <p className="text-sm text-center mt-2">
                                {taskDoc.filename}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {taskImages.length > 0 && (
              <div className="flex items-center justify-start gap-3 w-[90%] overflow-y-hidden overflow-x-auto h-[105px] pb-4 mx-2">
                <Dialog>
                  {taskImages.map((doc) => {
                    return (
                      <DialogTrigger>
                        <Image
                          alt="photo"
                          width={100}
                          height={100}
                          key={doc.id}
                          src={doc.file_url_with_protocol}
                          className="h-[100px] min-w-[100px] object-cover cursor-pointer"
                        />
                      </DialogTrigger>
                    );
                  })}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Task Images</DialogTitle>
                      <TaskCarousel images={taskImages} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {taskImages.length == 0 && (
              <div className="w-full h-[100px] flex text-neutral-300 items-center justify-center">
                <p>No Images uploaded yet</p>
              </div>
            )}
          </div>

          <div className="pb-4">
            <div className="flex items-center justify-between my-2 mx-2">
              <p>Timeline</p>
              <p className="text-sm text-blue-700 font-semibold">View All</p>
            </div>
            <div className="pt-2">
              {taskDetail?.timeline?.map((doc) => {
                return (
                  <div className="flex items-center justify-start border-[1px] border-neutral-200 rounded-md p-4 mx-2 mb-3">
                    <Image
                      src="/images/timeline.png"
                      alt="category"
                      width={24}
                      height={15}
                      className="mr-4 w-7 h-7 text-slate-600 "
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
