"use client";

import { TaskTableDemo } from "@/components/custom/task-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdClose } from "react-icons/md";

export default function TasksPage() {
  const t = useTranslations("PathnamesPage");
  const [addTask, setAddTask] = useState(false);

  const router = useRouter();

  return (
    <div  className="h-full w-full bg-white dark:bg-slate-900 overflow-y-hidden p-8 shadow-sm">
      <p className="text-[12px] text-slate-400 mb-4">Home / Projects / Tasks</p>
      <p className="text-lg font-semibold text-slate-900 mb-4">Tasks</p>
      <TaskTableDemo
        onTaskClick={() => {
          router.replace("/dashboard/tasks/task-detail");
        }}

        onAddTaskClick={() => {
            setAddTask(!addTask);
        }}
      />

      <div
        className={`absolute z-40 right-0 top-0 w-[500px] h-full bg-white shadow-lg p-8 transition-all duration-150 ${
          addTask ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-semibold">Add New Task</h1>
          <MdClose
            onClick={() => setAddTask(false)}
            className="cursor-pointer border-2 border-gray-200 text-3xl p-1 rounded-3xl"
          />
        </div>

        <form className="w-full" onSubmit={() => {}}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Task name</Label>
            <Input
              type="email"
              id="email"
              className="mb-6 w-full"
              placeholder="Task name"
              onChange={(e) => {}}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Categories</Label>
            <Input
              type="password"
              id="password"
              className="mb-8 w-full"
              placeholder="Select Category"
              onChange={(e) => {}}
            />
          </div>

          <Button
            type="submit"
            className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600"
          >
            Add Project
          </Button>
        </form>
      </div>
    </div>
  );
}
