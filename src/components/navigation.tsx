import { useTranslations } from 'next-intl';
import NavigationLink from './navigation-link';
import LocaleSwitcher from './locale-switcher';

export default function Navigation() {
    const t = useTranslations('Navigation');

    return (
        <div className="bg-slate-850">
            <nav className="container flex justify-between p-2 text-white">
                <div>
                    <NavigationLink href="/dashboard/tasks">{t('pathnames')}</NavigationLink>
                    <NavigationLink
                        href="/dashboard">{t('dashboard')}</NavigationLink>

                    <NavigationLink href="/">{t('dashboard')}</NavigationLink>
                </div>
                <LocaleSwitcher />
            </nav>
        </div>
    );
}
