import Link from "next/link";

export default async function Footer() {
  return (
    <div className="w-full bg-white">
      <div className="default-margin w-full md:flex justify-between items-baseline py-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <Link href="/about" className="text-lime-800">
            About us
          </Link>
          <Link href="/about/contact" className="text-lime-800">
            Contact
          </Link>
          <Link href="/about/shipping" className="text-lime-800">
            Shipping
          </Link>
          <Link href="/about/returns" className="text-lime-800">
            Returns
          </Link>
          <Link href="/about/terms" className="text-lime-800">
            Terms of Use
          </Link>
          <Link href="/about/privacy" className="text-lime-800">
            Privacy Policy
          </Link>
        </div>
        <p className="text-lime-400 text-md mt-2 md:mt-0">
          Ransan Farms Copyright © 2024.
        </p>
      </div>
    </div>
  );
}
