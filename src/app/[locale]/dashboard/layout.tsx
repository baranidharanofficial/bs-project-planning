"use client"

import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineBook, MdOutlineGroup } from "react-icons/md";
import { RiBuilding2Fill } from "react-icons/ri";
import Image from "next/image";
import { ReactNode, useState, useEffect } from 'react';
import Link from "next/link";
import Navigation from "@/components/custom/navigation";

type Props = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {

    const [collapsed, setCollapsed] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return null;
    }

    return (
        <main className="w-full h-[100vh] flex justify-start box-border">
            <div className={`h-[100vh] shadow-md p-4 relative transition-all duration-800 dark:bg-slate-900 ${collapsed ? 'w-[80px]' : 'w-[280px]'}`}>
                {!collapsed ? <Image priority={true} className="w-[60%] mb-4 ml-1" src="/images/logo.png" width={150} height={50} alt={""} /> : <Image priority={true} className="w-[40px] ml-[10%] scale-60 rounded-md mb-4" src="/images/logo2.png" width={50} height={50} alt={""} />}
                {!collapsed && <p className="text-sm text-slate-400 mb-2 ml-2">Overview</p>}
                <Link href="/dashboard">
                    <div className="text-md px-4 py-2 mb-1 flex items-center bg-green-50 dark:bg-slate-800 text-sm rounded-md cursor-pointer">
                        <RiBuilding2Fill className="text-xl text-green-700 dark:text-white" />
                        {!collapsed && <p className="ml-2 text-green-700 dark:text-white">Projects</p>}
                    </div>
                </Link>
                <Link href="/dashboard/book">
                    <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                        <MdOutlineBook className="text-xl" />
                        {!collapsed && <p className="ml-2">Book</p>}
                    </div>
                </Link>

                <Link href="/dashboard/teams">
                    <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 text-sm rounded-md cursor-pointer">
                        <MdOutlineGroup className="text-xl" />
                        {!collapsed && <p className="ml-2">Teams</p>}
                    </div>
                </Link>
                <div onClick={() => {
                    setCollapsed(!collapsed);
                }} className="absolute top-8 z-10 right-[-24px] p-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-white shadow-lg hover:shadow-md rounded-full cursor-pointer">
                    {!collapsed ? <IoIosArrowBack className="text-xl transition-all transform duration-800 rotate-0" /> : <IoIosArrowBack className="text-xl transition-all transform duration-800 rotate-180" />}
                </div>
            </div>
            <div className="w-full h-[100vh]">
                <Navigation />
                {children}
            </div>
        </main>
    );
}
