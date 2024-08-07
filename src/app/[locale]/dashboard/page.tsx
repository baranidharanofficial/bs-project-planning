"use client";

import Navigation from '@/components/custom/navigation';
import { DataTableDemo } from '@/components/custom/projects-table';
import { ThemeChanger } from '@/components/custom/theme-switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { MdClose } from 'react-icons/md';



type Props = {
    params: { locale: string };
};

export default function DashboardPage({ params: { locale } }: Props) {

    const t = useTranslations('PathnamesPage');

    const [project, setProject] = useState("");
    const [addProject, setAddProject] = useState(false);

    const router = useRouter();

    const handleProjectClick = useCallback((projectName: any) => {
        console.log(`Project clicked: ${projectName}`);
        setProject(projectName);

        router.replace('/dashboard/tasks');
    }, []);


    return (
        <div className="relative h-[90vh] w-full overflow-y-auto px-8">
            <DataTableDemo onProjectClick={handleProjectClick} onAddProjectClick={() => {
                console.log("Add project clicked");
                setAddProject(true);
            }} />

            <div className={`absolute z-40 right-0 top-0 w-[500px] h-full bg-white shadow-lg p-8 transition-all duration-150 ${addProject ? "block" : "hidden"}`}>
                <div className='flex items-center justify-between mb-8'>
                    <h1 className='font-semibold'>Add New Project</h1>
                    <MdClose onClick={() => setAddProject(false)} className='cursor-pointer border-2 border-gray-200 text-3xl p-1 rounded-3xl' />
                </div>

                <form className="w-full" onSubmit={() => { }}>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Project name</Label>
                        <Input type="email" id="email" className=" mb-6 w-full" placeholder="Project name" onChange={(e) => { }} />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Customer Name</Label>
                        <Input type="password" id="password" className=" mb-8 w-full" placeholder="Customer Name" onChange={(e) => { }} />
                    </div>


                    <Button type="submit" className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600">Add Project</Button>
                </form>
            </div>
        </div>
    );
}
