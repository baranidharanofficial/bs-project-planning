"use client";

import Navigation from '@/components/custom/navigation';
import { DataTableDemo } from '@/components/custom/projects-table';
import { ThemeChanger } from '@/components/custom/theme-switch';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';



type Props = {
    params: { locale: string };
};

export default function DashboardPage({ params: { locale } }: Props) {

    const t = useTranslations('PathnamesPage');

    const [project, setProject] = useState("");

    const router = useRouter();

    const handleProjectClick = useCallback((projectName: any) => {
        console.log(`Project clicked: ${projectName}`);
        setProject(projectName);

        router.replace('/dashboard/tasks');
    }, []);


    return (
        <div className="h-[90vh] w-full overflow-y-auto px-8">
            <DataTableDemo onProjectClick={handleProjectClick} />
        </div>
    );
}
