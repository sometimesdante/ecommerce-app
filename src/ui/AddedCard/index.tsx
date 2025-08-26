"use client";

import useCartStore from "@/store/cartStore";
import Image from "next/image";
import AddIcon from "@/../public/icons/add.png";
import DeleteIcon from "@/../public/icons/delete.png";
import { Product } from "@/utils/types";

const AddedCard = ({ name, count, product }: Product) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="w-full flex gap-2 justify-between items-center rounded-md">
      <p className="">
        {name} <span className="text-slate-400"></span>
      </p>
      <div className="flex w-24">
        <button
          className="w-16 flex justify-end"
          onClick={() => removeFromCart(product)}
        >
          <Image src={DeleteIcon} width={32} height={32} alt="" />
        </button>
        <span className="w-full font-semibold text-xl mb-0.5 text-center">
          {count}
        </span>
        <button
          className="w-16 flex justify-end"
          onClick={() => addToCart(product)}
        >
          <Image src={AddIcon} width={32} height={32} alt="" />
        </button>
      </div>
    </div>
  );
};

export default AddedCard;
