"use client";
import { Task, TaskTable } from "@/components/custom/task-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import { MdClose } from "react-icons/md";

export default function TasksPage() {
  const t = useTranslations("PathnamesPage");
  const [addTask, setAddTask] = useState(false);
  const [project, setProject] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Task[]>([]);

  // Fetch tasks when the project changes
  useEffect(() => {
      getTasks();
  }, []);

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Project ID : ");
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.get_tasks_list?project_id=PROJ-0001`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Tasks:", response.data);
      setData(response.data.tasks);

    } catch (error) {
      console.error("Get Tasks failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 overflow-y-hidden p-8 shadow-sm">
      <p className="text-[12px] text-slate-400 mb-4">Home / Projects / Tasks</p>
      <p className="text-lg font-semibold text-slate-900 mb-4">Tasks</p>
      <TaskTable
        onTaskClick={() => {}}
        onAddTaskClick={() => setAddTask(!addTask)}
        tasks={data}
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

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="task-name">Task name</Label>
            <Input
              type="text"
              id="task-name"
              className="mb-6 w-full"
              placeholder="Task name"
              onChange={(e) => {}}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="category">Categories</Label>
            <Input
              type="text"
              id="category"
              className="mb-8 w-full"
              placeholder="Select Category"
              onChange={(e) => {}}
            />
          </div>

          <Button
            type="submit"
            className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600"
          >
            Add Task
          </Button>
        </form>
      </div>
    </div>
  );
}
