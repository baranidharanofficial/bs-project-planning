import Navigation from '@/components/navigation';
import {
    getMessages,
    unstable_setRequestLocale
} from 'next-intl/server';
import { ReactNode } from 'react';

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
        <>
            <Navigation />
            {children}
        </>
    );
}
