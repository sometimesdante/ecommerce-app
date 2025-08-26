import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo.jpeg";
import { logout } from "@/app/auth/actions";

import Dashboard from "@/../public/icons/admin/dashboard.png";
import Orders from "@/../public/icons/admin/orders.png";
import Products from "@/../public/icons/admin/products.png";
import Gallery from "@/../public/icons/admin/gallery.png";
import Logout from "@/../public/icons/logout.png";

export default function Sidebar() {
  return (
    <div className="w-16 h-full fixed top-0 left-0 z-20 bg-lime-400">
      <div className="h-screen py-4 flex flex-col justify-between items-center">
        <div className="flex flex-col gap-4 items-center">
          <Link href="/" title="Home">
            <Image
              src={Logo}
              width={42}
              height={42}
              alt="Ransan Farms Logo"
              className="rounded-full"
            />
          </Link>
          <Link href="/admin" title="Dashboard">
            <Image
              src={Dashboard}
              width={32}
              height={32}
              alt="dashboard icon"
              className="aspect-square"
            />
          </Link>
          <Link href="/admin/orders" title="Manage Orders">
            <Image
              src={Orders}
              width={32}
              height={32}
              alt="dashboard icon"
              className="aspect-square"
            />
          </Link>
          <Link href="/admin/products" title="Manage Products">
            <Image
              src={Products}
              width={32}
              height={32}
              alt="dashboard icon"
              className="aspect-square"
            />
          </Link>
          <Link href="/admin/gallery" title="Gallery">
            <Image
              src={Gallery}
              width={32}
              height={32}
              alt="dashboard icon"
              className="aspect-square"
            />
          </Link>
        </div>
        <div>
          <button onClick={logout} className="text-lime-800" title="Logout">
            <Image
              src={Logout}
              width={32}
              height={32}
              alt="dashboard icon"
              className="aspect-square"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
