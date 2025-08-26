"use client";

import useCartStore from "@/store/cartStore";
import { Product } from "@/utils/types";
import { useState } from "react";
import AddedCard from "../AddedCard";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/../public/icons/cart.png";

const Cart = () => {
  const totalItems = useCartStore((state: any) => state.totalItems);
  const totalPrice = useCartStore((state: any) => state.totalPrice);
  const cart = useCartStore((state: any) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [viewCart, setViewCart] = useState(false);

  const handleClick = () => {
    setViewCart(!viewCart);
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col items-end">
      <button
        onClick={handleClick}
        className="flex gap-2 items-center text-slate-200 bg-slate-600 rounded-md px-4 no-underline font-semibold py-2"
      >
        {viewCart ? "Hide Cart" : "View Cart"}{" "}
        {totalItems > 0 ? `(${totalItems})` : null}
        <Image src={CartIcon} width={18} height={18} alt="" />
      </button>
      {viewCart && (
        <div className="relative w-full right-0">
          <div className="absolute top-0 right-0 bg-white flex flex-col justify-between gap-4 p-4 mt-4 rounded-md shadow-md">
            <div className="flex flex-col gap-2 h-64 md:h-80 overflow-y-scroll">
              {cart!.length > 0 ? (
                cart.map((product: Product) => (
                  <div key={product?.id}>
                    <AddedCard
                      name={product.name}
                      count={product.count}
                      price={product.price}
                      product={product}
                    />
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="https://forms.gle/2UUfDvaLCsf1AXYF8"
                className="text-lime-400 font-semibold"
                target="_blank"
              >
                Request new item
              </Link>
              <p>Total Price: {totalPrice}</p>
              {totalItems > 0 && (
                <span className="flex justify-between gap-2">
                  <button
                    onClick={() => clearCart()}
                    className="w-1/3 md:w-1/4 flex justify-center items-center bg-red-400 text-white font-semibold px-4 rounded-md"
                  >
                    Clear
                  </button>
                  <Link
                    href="/account/checkout"
                    className="w-2/3 md:w-3/4 text-white bg-lime-400 py-2 px-4 font-semibold rounded-md no-underline"
                  >
                    Checkout
                  </Link>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
