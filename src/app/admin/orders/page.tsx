import { createClient } from "@/utils/supabase/server";
import OrderStatus from "@/ui/OrderStatus";
import GenerateBill from "@/ui/GenerateBill";
import { redirect } from "next/navigation";
import ExportOrders from "@/ui/ExportOrders";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import CustomInvoice from "@/ui/CustomInvoice";

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span>No items</span>;
  }
  return (
    <span>
      {products.map((item: any) => (
        <span key={item.id}>
          {item.name} x {item.count},{" "}
        </span>
      ))}
    </span>
  );
}

function OrderRow(order: any) {
  return (
    <span className="flex mb-2 items-start">
      <span className="flex border-2 bg-white rounded-md py-1">
        <p className="w-12 px-2">{order.invoice_id}</p>
        <p className="w-44 px-1">
          {format(
            toZonedTime(order.created_at, "Asia/Kolkata"),
            "HH:mm:ss dd/MM/yyyy"
          )}
        </p>
        <p className="w-32 px-1">
          {order.name} <br />
          {order.phone} <br />
          {order.email} <br />
          {order.address}
        </p>
        <p className="w-32 px-1 capitalize">{order.payment_status}</p>
        <OrderStatus id={order.id} />
        <p className="w-40 px-1">{order.amount}</p>
        <p className="w-40 px-1">
          <OrderItems products={order.products} />
        </p>
      </span>
      <GenerateBill id={order.id} />
    </span>
  );
}

export default async function OrdersDashboard() {
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

  const { data: orders } = await supabase
    .from("transactions")
    .select()
    .order("created_at", { ascending: false })
    .neq("razorpay_id", "NULL");

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl mb-4">Orders Dashboard</h1>
        <p>No orders available</p>
      </div>
    );
  }

  return (
    <div>
      <span className="w-full flex justify-between mb-8">
        <h1 className="text-3xl">Orders Dashboard</h1>
        <span className="flex gap-2">
          <CustomInvoice />
          <ExportOrders />
        </span>
      </span>
      <div className="w-full">
        <span className="flex mb-2">
          <p className="w-12 px-1 font-semibold">ID</p>
          <p className="w-44 px-1 font-semibold">Order Date</p>
          <p className="w-32 px-1 font-semibold">User Details</p>
          <p className="w-32 px-1 font-semibold">Payment</p>
          <p className="w-40 px-1 font-semibold mx-2">Delivery</p>
          <p className="w-40 px-1 font-semibold">Order Amount</p>
          <p className="w-40 px-1 font-semibold">Products</p>
          <span className="w-16 mx-2"></span>
        </span>
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <OrderRow
              key={order.id}
              id={order.id}
              invoice_id={order.invoice_id}
              created_at={order.created_at}
              name={order.name}
              email={order.email}
              phone={order.phone}
              address={order.address}
              payment_status={order.payment_status}
              delivery_status={order.delivery_status}
              amount={order.amount}
              products={order.products}
            />
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
}
