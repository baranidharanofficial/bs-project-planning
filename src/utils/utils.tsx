import { locales } from "@/config";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    params: { locale: string };
  };
  
  export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
  }
  
  export async function generateMetadata({
    params: { locale },
  }: Omit<Props, "children">) {
    const t = await getTranslations({ locale, namespace: "LocaleLayout" });
  
    return {
      title: t("title"),
    };
  }