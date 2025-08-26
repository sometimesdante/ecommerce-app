import GenerateBill from "@/ui/GenerateBill";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span>No items</span>;
  }
  return (
    <span>
      {products.map((item: any) => (
        <span key={item.id}>
          {item.name} x {item.count}
          <br />
        </span>
      ))}
    </span>
  );
}

function OrderRow(order: any) {
  return (
    <span className="flex mb-2 items-start">
      <span className="flex bg-white rounded-md py-1 h-10">
        <p className="w-12 px-2">{order.id}</p>
        <p className="w-44 px-1">
          {format(
            toZonedTime(order.created_at, "Asia/Kolkata"),
            "HH:mm:ss dd/MM/yyyy"
          )}
        </p>
        <p className="w-32 px-1 truncate text-ellipsis">{order.razorpay_id}</p>
        <p className="w-32 px-1 capitalize">{order.payment_status}</p>
        <p className="w-32 px-1 capitalize">{order.delivery_status}</p>
        <p className="w-32 px-1">{order.amount}</p>
        <p className="w-40 px-1">
          <OrderItems products={order.products} />
        </p>
      </span>
      <GenerateBill id={order.id} />
    </span>
  );
}

export default async function Orders() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("transactions")
    .select()
    .eq("email", data?.user?.email);

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl mb-4">Orders</h1>
        <p>No orders available</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl mb-4">Your Orders</h1>
      <div className="w-fit">
        <span className="flex mb-2">
          <p className="w-12 px-1 font-semibold">ID</p>
          <p className="w-44 px-1 font-semibold">Order Date</p>
          <p className="w-32 px-1 font-semibold">Razorpay ID</p>
          <p className="w-32 px-1 font-semibold">Payment</p>
          <p className="w-32 px-1 font-semibold">Delivery</p>
          <p className="w-32 px-1 font-semibold">Order Amount</p>
          <p className="w-40 px-1 font-semibold">Products</p>
          <span className="w-16 mx-2"></span>
        </span>
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <OrderRow
              key={order.id}
              id={order.id}
              created_at={order.created_at}
              razorpay_id={order.razorpay_id}
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
