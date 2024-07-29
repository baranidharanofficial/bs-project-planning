import { useTranslations } from 'next-intl';
import NavigationLink from './navigation-link';
import LocaleSwitcher from './locale-switcher';
import { ThemeChanger } from './theme-switch';

export default function Navigation() {
    const t = useTranslations('Navigation');

    return (
        <div className="bg-white dark:bg-slate-950">
            <nav className="container flex justify-between p-2 text-white">
                <div>
                    <NavigationLink href="/dashboard/tasks">{t('pathnames')}</NavigationLink>
                    <NavigationLink
                        href="/dashboard">{t('dashboard')}</NavigationLink>

                    <NavigationLink href="/">{t('dashboard')}</NavigationLink>
                </div>
                <div>
                    <ThemeChanger />
                    <LocaleSwitcher />
                </div>

            </nav>
        </div>
    );
}
