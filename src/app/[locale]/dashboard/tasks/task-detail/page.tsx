"use client";

import { formatDate } from "@/components/custom/date-format";
import GaugeChart from "@/components/custom/gauge-chart";
import { Assignee } from "@/components/custom/task-table";
import { PogressDropdown } from "@/components/ui/dropdown";
import { Textarea } from "@/components/ui/textarea";
import { RootState, store } from "@/state/store";
import Link from "next/link";
import React from "react";
import {
  MdAdd,
  MdArrowBackIos,
  MdClose,
  MdDescription,
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
  const taskDetail = useSelector((state : RootState) => state.task.currentTaskDetails);
  const task = useSelector((state : RootState) => state.task.currentTask);

  
  return (

      <div className="bg-neutral-100 h-full w-full flex items-center rounded-sm justify-between">
        <div className="bg-white h-full w-[65%] p-6">
          <p className="text-[12px] text-slate-400 mb-6">
            Home / Projects / Tasks / {task?.title}
          </p>
          <div className="flex items-center justify-start text-xl font-semibold mb-4">
            <Link href="/dashboard/tasks"><MdArrowBackIos className="mr-2" /></Link>
            <p className="mr-2">{task?.title}</p>
            <PiCaretUpDownBold />
          </div>

          <div className="ml-8">
            <div className="text-slate-400 flex items-center justify-start my-6">
              <MdOutlineFolder className="mr-2" />
              <p className="mr-8 text-[12px]">Category</p>
              <p className="text-black font-medium">{task?.category}</p>
            </div>
            <div className="text-slate-400 flex items-center justify-start my-6">
              <MdOutlineCalendarMonth className="mr-2" />
              <p className="mr-6 text-[12px]">Start Date</p>
              <p className="text-black font-medium">{formatDate(taskDetail?.start_date)}</p>
            </div>
            <div className="text-slate-400 flex items-center justify-start my-6">
              <MdOutlineCalendarMonth className="mr-2" />
              <p className="mr-8 text-[12px]">End Date</p>
              <p className="text-black font-medium">{formatDate(taskDetail?.end_date)}</p>
            </div>
            <div className="text-slate-400 flex items-center justify-start my-6">
              <MdOutlinePerson className="mr-2" />
              <p className="mr-8 text-[12px]">Assignee</p>

              <div className="flex items-center justify-start">
                <MdAdd className="text-green-600 bg-neutral-100 text-4xl p-1 rounded-full" />

                {
                  taskDetail?.assignee.map((user : Assignee) => {
                    return <div className="ml-4 p-2 bg-neutral-100 rounded-sm flex items-center">
                    <img
                      src="https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp"
                      className="h-6 w-6 rounded-full"
                    />
                    <p className="text-black mx-2">{user.user_name}</p>
                    <MdClose className="text-red-500 text-2xl" />
                  </div>
                  })
                }
              
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
              <MdAdd className="text-green-600 bg-neutral-100 text-[60px] p-2 rounded-md" />

              <div className="ml-4 py-2 px-3 bg-neutral-100 rounded-sm flex items-center">
                <MdOutlinePictureAsPdf className="text-red-500 text-4xl" />

                <div>
                  <p className="text-black mx-2">File Name.pdf</p>
                  <p className="text-neutral-400 text-sm mx-2">1.5 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white h-full w-[34%] p-6">
          <div className="w-full h-[220px] border-solid border-2 border-neutral-100 rounded-md p-4">
            <div className="mb-3 px-1">
              <div className="flex items-center justify-between border-b-2 border-solid border-neutral-100 pb-4 mb-4">
                <p>Status</p>
                <PogressDropdown selected={task?.status || "In Progress"} />
              </div>

              <div className="">
                <GaugeChart percentage={100} />
              </div>
            </div>
          </div>
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <p>Images</p>
              <p className="text-sm text-blue-700 font-semibold">View All</p>
            </div>
            <div className="flex items-center justify-start gap-3 w-full overflow-x-auto">
              <img
                src="https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp"
                className="h-[150px] w-[150px] object-cover"
              />
              <img
                src="https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp"
                className="h-[150px] w-[150px] object-cover"
              />
              <img
                src="https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp"
                className="h-[150px] w-[150px] object-cover"
              />
            </div>
          </div>
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <p>Timeline</p>
              <p className="text-sm text-blue-700 font-semibold">View All</p>
            </div>
            <div className="h-[300px] overflow-y-auto">
              <div className="shadow-lg rounded-md p-4 mx-1 mb-3">
                  <p>Added 20 Labour hours</p>
                  <div className="text-sm text-neutral-300 flex items-center justify-between">
                    <p>20 May, 2024</p>
                    <p>Rayees</p>
                  </div>
              </div>
              <div className="shadow-lg rounded-md p-4 mx-1 mb-3">
                  <p>Added 20 Labour hours</p>
                  <div className="text-sm text-neutral-300 flex items-center justify-between">
                    <p>20 May, 2024</p>
                    <p>Rayees</p>
                  </div>
              </div>
              <div className="shadow-lg rounded-md p-4 mx-1 ">
                  <p>Added 20 Labour hours</p>
                  <div className="text-sm text-neutral-300 flex items-center justify-between">
                    <p>20 May, 2024</p>
                    <p>Rayees</p>
                  </div>
              </div>
              <div className="shadow-lg rounded-md p-4 mx-1 ">
                  <p>Added 20 Labour hours</p>
                  <div className="text-sm text-neutral-300 flex items-center justify-between">
                    <p>20 May, 2024</p>
                    <p>Rayees</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}
