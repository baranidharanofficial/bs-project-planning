import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import {
    getMessages,
    getTranslations,
    unstable_setRequestLocale
} from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '@/config';
import { ThemeProvider } from '@/components/custom/theme-provider';

const inter = Inter({ subsets: ['latin'] });

type Props = {
    children: ReactNode;
    params: { locale: string };
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params: { locale }
}: Omit<Props, 'children'>) {
    const t = await getTranslations({ locale, namespace: 'LocaleLayout' });

    return {
        title: t('title')
    };
}

export default async function LocaleLayout({
    children,
    params: { locale }
}: Props) {
    // Enable static rendering
    unstable_setRequestLocale(locale);

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={clsx(inter.className, 'flex h-full flex-col')}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    key="theme-provider"
                >
                    <NextIntlClientProvider messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
