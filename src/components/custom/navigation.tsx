import { useTranslations } from 'next-intl';
import NavigationLink from './navigation-link';
import LocaleSwitcher from './locale-switcher';
import { ThemeChanger } from './theme-switch';

export default function Navigation() {
    const t = useTranslations('Navigation');



    return (
        <nav className="w-full flex justify-between text-white mb-4">
            <p className=' text-black dark:text-white font-semibold'>{t("home")}</p>
            <div className='flex'>
                <ThemeChanger />
                <LocaleSwitcher />
            </div>
        </nav>
    );
}
