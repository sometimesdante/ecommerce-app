"use client";

import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { useState } from "react";

interface EditProductProps {
  id: number | undefined;
  onProductUpdate: () => void;
}

export default function EditProduct({ id, onProductUpdate }: EditProductProps) {
  const supabase = createClient();
  const [showFields, setShowFields] = useState(false);
  const [product, setProduct] = useState<Product>();

  const handleClick = () => {
    setShowFields(!showFields);
  };

  async function fetchProduct() {
    handleClick();
    const numericId = typeof id === "string" ? Number(id) : id;

    try {
      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("id", numericId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        console.log(product);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      purchase: formData.get("purchase") as string,
      mrp: formData.get("mrp") as string,
      pretax: formData.get("special") as string,
      tax: formData.get("tax") as string,
      price: formData.get("price") as string,
      inventory: formData.get("inventory") as string,
    };

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: data.name,
          category: data.category,
          purchase: data.purchase,
          mrp: data.mrp,
          pretax: data.pretax,
          tax: data.tax,
          price: data.price,
          inventory: data.inventory,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating product information to supabase", error);
      } else {
        console.log("Product updated successfully");
        onProductUpdate(); // Trigger data refresh in the parent
      }
    } catch (err) {
      console.error("Unexpected error", err);
    } finally {
      handleClick();
    }
  }

  return (
    <div>
      <button onClick={() => fetchProduct()} className="w-16 px-2 py-1">
        Edit
      </button>
      {showFields && product && (
        <div className="fixed w-screen h-screen flex items-center justify-center bg-white/60 z-30 top-0 left-0 backdrop-blur-sm">
          <div className="relative mx-auto bg-white rounded-md shadow-md w-1/3 p-4">
            <form onSubmit={handleSubmit}>
              <h6>{product?.name}</h6>
              <span className="flex flex-col gap-2">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Some Product Name"
                  defaultValue={product?.name}
                  className="border-2 px-2 py-1 w-fit"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Category"
                  defaultValue={product?.category}
                  className="border-2 px-2 py-1 w-fit"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>Purchase Price</label>
                <input
                  type="number"
                  name="purchase"
                  id="purchase"
                  placeholder="0"
                  defaultValue={product?.purchase || 0}
                  className="border-2 px-2 py-1 w-fit"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>MRP</label>
                <input
                  type="number"
                  name="mrp"
                  id="mrp"
                  placeholder="0"
                  defaultValue={product?.mrp}
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>Special</label>
                <input
                  type="number"
                  name="special"
                  id="special"
                  placeholder="0"
                  defaultValue={product?.pretax}
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>Tax</label>
                <input
                  type="number"
                  name="tax"
                  id="tax"
                  placeholder="0"
                  defaultValue={product?.tax}
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="0"
                  defaultValue={product?.price}
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                />
              </span>
              <span className="flex flex-col gap-2">
                <label>Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  id="inventory"
                  placeholder="0"
                  defaultValue={product?.inventory}
                  className="border-2 px-2 py-1 w-fit"
                />
              </span>
              <span className="flex gap-4 mt-4">
                <button
                  className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
                  type="submit"
                >
                  Update
                </button>
                <button
                  onClick={handleClick}
                  className="bg-white text-slate-600 border-2 border-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
                  type="submit"
                >
                  Close
                </button>
              </span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
