"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { gcompanyId } from "@/utils/utils";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const usr = searchParams.get("user");
  const pwd = searchParams.get("password");

  useEffect(() => {
    const login = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.auth.user_login`,
          { usr, pwd }
        );
        const message = response.data.message;

        // Store necessary data in localStorage
        localStorage.setItem("sid", message.sid);
        localStorage.setItem("api_key", message.api_key);
        localStorage.setItem("api_secret", message.api_secret);
        localStorage.setItem("company_id", companyId);

        setLoggedIn(true);
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed");
      } finally {
        setLoading(false);
      }
    };

    login();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-white dark:bg-slate-950">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-white dark:bg-slate-950">
      {loggedIn ? (
        <p className="w-full text-[12px] text-green-500 dark:text-white text-center mt-2">
          {usr}
        </p>
      ) : (
        <div>Not a valid user</div>
      )}
    </div>
  );
}
