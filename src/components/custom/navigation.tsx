import { useTranslations } from 'next-intl';
import NavigationLink from './navigation-link';
import LocaleSwitcher from './locale-switcher';
import { ThemeChanger } from './theme-switch';

export default function Navigation() {
    const t = useTranslations('Navigation');



    return (
        <div className="bg-white dark:bg-slate-950">
            <nav className="w-full flex justify-between p-2 pl-8 text-white">
                <p className=' text-black dark:text-white px-2 py-3 font-semibold'>{t("home")}</p>
                <div className='flex'>
                    <ThemeChanger />
                    <LocaleSwitcher />
                </div>
            </nav>
        </div>
    );
}
