"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function AddProduct() {
  const supabase = createClient();
  const [showFields, setShowFields] = useState(false);
  const [imageURL, setImageURL] = useState<any>();
  const [error, setError] = useState<any>();
  const bucket = "productImages";

  const handleClick = () => {
    setShowFields(!showFields);
  };

  const getURL = async (path: any) => {
    const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
    setImageURL(data.publicUrl);
    return;
  };

  const uploadFile = async (event: any) => {
    const file = event.target.files[0];

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(file.name, file);
    console.log(data, error);

    if (error) {
      setError(error.message);
      return;
    } else {
      getURL(data.path);
      return;
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      purchase: formData.get("purchase"),
      mrp: formData.get("mrp") as string,
      pretax: formData.get("special") as string,
      tax: formData.get("tax") as string,
      price: formData.get("price") as string,
      inventory: formData.get("inventory") as string,
    };

    try {
      const { error } = await supabase.from("products").insert({
        name: data.name,
        category: data.category,
        purchase: data.purchase,
        mrp: data.mrp,
        pretax: data.pretax,
        tax: data.tax,
        price: data.price,
        inventory: data.inventory,
        image_url: imageURL,
      });

      if (error) {
        console.error("Error adding new product to supabase", error);
      } else {
        console.log("Product added successfully");
      }
    } catch (err) {
      console.error("Unexpected error", err);
    } finally {
      handleClick();
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex gap-2 items-center text-slate-200 bg-slate-600 rounded-md px-4 no-underline font-semibold py-2"
      >
        Add
      </button>
      {showFields && (
        <div className="fixed w-screen h-screen flex items-center justify-center bg-white/60 z-30 top-0 left-0 backdrop-blur-sm">
          <div className="relative mx-auto bg-white rounded-md shadow-md w-1/3 p-4">
            <form onSubmit={handleSubmit}>
              <h6 className="mb-4">Add new product</h6>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Some Product Name"
                  className="border-2 px-2 py-1 w-fit"
                  required
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Category</label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Others"
                  defaultValue="Others"
                  className="border-2 px-2 py-1 w-fit"
                  required
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Purchase Price</label>
                <input
                  type="text"
                  name="purchase"
                  id="purchase"
                  placeholder="0"
                  className="border-2 px-2 py-1 w-fit"
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">MRP</label>
                <input
                  type="number"
                  name="mrp"
                  id="mrp"
                  placeholder="0"
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Special</label>
                <input
                  type="number"
                  name="special"
                  id="special"
                  placeholder="0"
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Tax</label>
                <input
                  type="number"
                  name="tax"
                  id="tax"
                  placeholder="0"
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                  defaultValue="0"
                  required
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="0"
                  className="border-2 px-2 py-1 w-fit"
                  step="any"
                  required
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  id="inventory"
                  placeholder="0"
                  defaultValue={1}
                  className="border-2 px-2 py-1 w-fit"
                  required
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-64">
                  Upload Image (Resize{" "}
                  <Link
                    href="https://bulkresizephotos.com/en?preset=true&format=webp&quality=30&transparency=false"
                    target="_blank"
                  >
                    here
                  </Link>
                  )
                </label>
                <input
                  type="file"
                  name="upload"
                  id="upload"
                  className="border-2 px-2 py-1 w-fit"
                  required
                  onChange={uploadFile}
                />
                {error && (
                  <span className="text-red-400 italic">Error: {error}</span>
                )}
              </span>
              <span className="flex gap-4 mt-4">
                <button
                  className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
                  type="submit"
                >
                  Add
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
