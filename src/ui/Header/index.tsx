import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo.jpeg";

import { createClient } from "@/utils/supabase/server";
import MoreButton from "../MoreButton";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="w-full fixed top-0 z-50 py-2 shadow-md bg-lime-400">
      <div className="default-margin w-full flex justify-between items-center">
        <Link
          href="/"
          className="flex flex-row items-center gap-4 no-underline"
        >
          <div className="flex">
            <Image
              src={Logo}
              width={64}
              height={64}
              alt="Ransan Farms Logo"
              className="aspect-square block md:hidden"
            />
            <Image
              src={Logo}
              width={64}
              height={64}
              alt="Ransan Farms Logo"
              className="aspect-square hidden md:block"
            />
          </div>
          <p className="no-underline font-semibold text-md md:text-xl">
            Ransan Farms and Foods
          </p>
        </Link>

        <div className="flex flex-col md:flex-row md:gap-4 items-baseline">
          {data.user ? (
            <MoreButton />
          ) : (
            <Link href="/auth/login" className="text-md underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
