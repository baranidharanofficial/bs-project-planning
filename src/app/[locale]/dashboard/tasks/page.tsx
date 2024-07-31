"use client"

import { TaskTableDemo } from '@/components/custom/task-table';
import { useTranslations } from 'next-intl';
import { MdCheckCircle, MdFileOpen, MdFolder, MdOutlineBook, MdOutlineGroup, MdPerson } from "react-icons/md";
import { useCallback, useState } from 'react';


export default function TasksPage() {


    const t = useTranslations('PathnamesPage');

    const [project, setProject] = useState("");

    const handleProjectClick = useCallback((projectName: any) => {
        console.log(`Project clicked: ${projectName}`);
        setProject(projectName);
    }, []);

    return (
        <main className="w-full h-[90vh] flex items-center justify-between box-border shadow-sm">
            <div className="w-[280px] h-full p-4 relative">

                <p className="text-sm text-slate-400 mb-2 ml-2">Project {project}</p>

                <div className="text-md px-4 py-2 mb-1 flex items-center bg-green-50 dark:bg-slate-800 text-sm rounded-md cursor-pointer">
                    <MdCheckCircle className="text-xl text-green-700 dark:text-white" />
                    <p className="ml-2 text-green-700 dark:text-white">Tasks</p>
                </div>
                <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                    <MdPerson className="text-xl" />
                    <p className="ml-2">Attendance</p>
                </div>
                <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                    <MdFolder className="text-xl" />
                    <p className="ml-2">Files</p>
                </div>
                {/* <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 text-sm rounded-md cursor-pointer">
              <IoDocumentTextOutline className="text-xl" />
              <p className="ml-2">Files</p>
            </div>
            <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 text-sm rounded-md cursor-pointer">
              <MdOutlineInventory2 className="text-xl" />
              <p className="ml-2">Stocks</p>
            </div> */}


            </div>
            <div className="w-full h-full p-6">
                <TaskTableDemo onTaskClick={handleProjectClick} />
            </div>
        </main>
    );
}
