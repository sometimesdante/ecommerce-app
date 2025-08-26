"use client";

import useCartStore from "@/store/cartStore";
import { Product } from "@/utils/types";
import Image from "next/image";
import AddIcon from "@/../public/icons/add.png";
import DeleteIcon from "@/../public/icons/delete.png";
import { useEffect, useState } from "react";

const ProductCard = ({
  image_url,
  name,
  price,
  category,
  product,
}: Product) => {
  const cart = useCartStore((state: any) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const [item, setItem] = useState<Product | null>(null);

  useEffect(() => {
    const cartItem = cart.find(
      (cartProduct: Product) => cartProduct.name === product.name
    );

    if (cartItem) {
      setItem(cartItem);
    } else {
      setItem(null);
    }
  }, [cart, product.name]);

  return (
    <div className="w-full h-full rounded-md shadow-md bg-white">
      <div className="w-full rounded-md aspect-square overflow-hidden flex items-center">
        <Image src={image_url.trimEnd()} width={256} height={256} alt={name} />
      </div>
      <div className="rounded-md p-2">
        <p className="text-md">{name}</p>
        <p className="text-md text-slate-400">{category}</p>
        <p className="flex gap-2 items-center">
          <span className="text-lime-400 text-xl font-semibold">₹{price} </span>
          <span className="text-md text-slate-400">(Incl. Tax)</span>
        </p>
        {product.count ? (
          <span className="flex gap-2">
            <button
              onClick={() => removeFromCart(product)}
              className="w-1/4 flex justify-center border-2 border-red-400 text-lime-400 py-2 mt-2 font-semibold rounded-md"
            >
              <Image src={DeleteIcon} width={24} height={12} alt="" />
            </button>
            <button
              onClick={() => addToCart(product)}
              className="w-3/4 flex justify-center border-2 border-lime-400 text-lime-400 py-2 mt-2 font-semibold rounded-md"
            >
              <span className="flex gap-2">
                Add
                <Image src={AddIcon} width={24} height={12} alt="" />
              </span>
            </button>
          </span>
        ) : (
          <span className="w-full flex justify-end mt-2">
            <span className="flex justify-between items-center border-2 border-slate-200 rounded-full px-1 py-0.5">
              {item && item.count ? (
                <button
                  className="w-12"
                  onClick={() => removeFromCart(product)}
                >
                  <Image src={DeleteIcon} width={32} height={32} alt="" />
                </button>
              ) : (
                <span className="w-12"></span>
              )}
              <span className="w-full font-semibold text-2xl w-6 mb-0.5 text-center">
                {item ? item.count : ""}
              </span>
              <button
                className="w-12 flex justify-end"
                onClick={() => addToCart(product)}
              >
                <Image src={AddIcon} width={32} height={32} alt="" />
              </button>
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
