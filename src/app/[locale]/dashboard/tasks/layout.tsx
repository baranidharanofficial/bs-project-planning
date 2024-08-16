"use client";

import { TaskTableDemo } from "@/components/custom/task-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { MdCheckCircle, MdClose, MdFolder, MdOutlineFolder, MdOutlinePerson, MdPerson } from "react-icons/md";

type Props = {
    children: ReactNode;
};

export default function TaskLayout({ children }: Props) {
  const t = useTranslations("PathnamesPage");
  const [project, setProject] = useState("");
  const [addTask, setAddTask] = useState(false);

  const router = useRouter();

  return (
    <main className="relative w-full h-[90vh] flex items-center justify-between box-border">
      <div className="w-[300px] h-full bg-white dark:bg-slate-900 p-4 rounded-sm">
        <div className="w-[100%] flex flex-col items-center justify-center">
          <img src="https://cdn.cpdonline.co.uk/wp-content/uploads/2023/03/04151341/Everything-you-need-to-know-about-Construction-Site-Safety.jpg" className="h-[150px] w-[150px] object-cover rounded-full" />
          <p className="text-lg font-semibold text-slate-900 dark:text-white  mt-2 mb-6">Project {project}</p>
        </div>

        <Link href="/dashboard/tasks/">
            <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                <p className="ml-2">Dashboard</p>
            </div>
        </Link>
        
        <Link href="/dashboard/tasks">
            <div className="text-md px-4 py-2 mb-1 flex items-center bg-[#37AD4A] rounded-sm dark:bg-slate-800 text-sm cursor-pointer">
                <p className="ml-2 text-white">Tasks</p>
            </div>  
        </Link>

        <Link href="/dashboard/tasks/attendance">
            <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                <p className="ml-2">Attendance</p>
            </div>
        </Link>
        
        <Link href="/dashboard/tasks/files">
            <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                <p className="ml-2">Files</p>
            </div>
        </Link>
      </div>

      <div className="w-full h-full pl-5 relative">
       {children}
      </div>
    </main>
  );
}
