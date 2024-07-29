
import NavigationLink from '@/components/custom/navigation-link';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

type Props = {
    params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
    // Enable static rendering
    unstable_setRequestLocale(locale);

    const t = useTranslations('IndexPage');

    const t2 = useTranslations('Navigation');

    return (
        <div>
            <p>Login</p>
            <NavigationLink href="/dashboard">{t2('dashboard')}</NavigationLink>
        </div>
    );
}
