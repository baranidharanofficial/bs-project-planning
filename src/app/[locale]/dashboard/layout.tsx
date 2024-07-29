import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineBook, MdOutlineGroup, } from "react-icons/md";
import { RiBuilding2Fill } from "react-icons/ri";
import Image from "next/image";
import {
    getMessages,
    unstable_setRequestLocale
} from 'next-intl/server';
import { ReactNode } from 'react';
import Link from "next/link";
import Navigation from "@/components/custom/navigation";

type Props = {
    children: ReactNode;
    params: { locale: string };
};


export default async function DashboardLayout({
    children,
    params: { locale }
}: Props) {
    unstable_setRequestLocale(locale);

    return (
        <main className="w-full h-[100vh] flex justify-start box-border">
            <div className="w-[280px] h-[100vh] shadow-md p-4 relative dark:bg-black">
                <Image priority={true} className="w-[50%] mb-4" src="/images/logo.png" width={150} height={50} alt={""} />
                <p className="text-sm text-slate-400 mb-2 ml-2">Overview</p>
                <Link href="/dashboard">
                    <div className="text-md px-4 py-2 mb-1 flex items-center bg-green-50 text-sm rounded-md cursor-pointer">
                        <RiBuilding2Fill className="text-xl text-green-700" />
                        <p className="ml-2 text-green-700">Projects</p>
                    </div>
                </Link>
                <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 text-sm rounded-md cursor-pointer">
                    <MdOutlineBook className="text-xl" />
                    <p className="ml-2">Book</p>
                </div>
                <div className="text-md px-4 py-2 mb-1 flex items-center hover:bg-slate-50 text-sm rounded-md cursor-pointer">
                    <MdOutlineGroup className="text-xl" />
                    <p className="ml-2">Teams</p>
                </div>
                <div className="absolute top-8 right-[-16px] p-2 bg-white shadow-lg hover:shadow-md rounded-full cursor-pointer">
                    <IoIosArrowBack className="text-xl" />
                </div>
            </div>
            <div className="w-full h-[100vh]">
                <Navigation />

                {children}
            </div>
        </main>
    );
}
