import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const role = await supabase
    .from("profiles")
    .select()
    .eq("email", data?.user?.email)
    .single();

  if (error || !data?.user || role.data.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="">
      <h1 className="text-3xl">Dashboard</h1>
      <div className="flex flex-col gap-4 my-8">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/products">Products</Link>
      </div>
    </div>
  );
}
