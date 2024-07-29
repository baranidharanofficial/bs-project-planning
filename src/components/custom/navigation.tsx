import { useTranslations } from 'next-intl';
import NavigationLink from './navigation-link';
import LocaleSwitcher from './locale-switcher';
import { ThemeChanger } from './theme-switch';

export default function Navigation() {
    const t = useTranslations('Navigation');

    return (
        <div className="bg-white dark:bg-slate-950">
            <nav className="container flex justify-between p-2 text-white">
                <p className=' text-black dark:text-white px-2 py-3 font-semibold'>Home</p>
                <div className='flex'>
                    <ThemeChanger />
                    <LocaleSwitcher />
                </div>

            </nav>
        </div>
    );
}
