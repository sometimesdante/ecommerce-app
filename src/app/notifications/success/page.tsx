"use client";

import Link from "next/link";
import useCartStore from "@/store/cartStore";

export default function Home() {
  const clearCart = useCartStore((state) => state.clearCart);

  clearCart();

  return (
    <div>
      <h2>Your payment was a success!</h2>
      <Link href="/account/orders">Go to your orders</Link>
    </div>
  );
}
