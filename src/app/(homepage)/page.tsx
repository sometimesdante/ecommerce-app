"use client";

import Image from "next/image";
import SearchIcon from "@/../public/icons/search.png";
import Cart from "@/ui/Cart";
import ProductCard from "@/ui/ProductCard";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchText, setSearchText] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [clickStatus, setClickStatus] = useState(false);
  const [category, setCategory] = useState("All Categories");
  const [categoryArray, setCategoryArray] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } =
        searchText.length > 0
          ? category == "All Categories"
            ? await supabase
                .from("products")
                .select()
                .neq("inventory", 0)
                .ilike("name", `%${searchText}%`)
                .order("name", { ascending: true })
            : await supabase
                .from("products")
                .select()
                .eq("category", category)
                .neq("inventory", 0)
                .ilike("name", `%${searchText}%`)
                .order("name", { ascending: true })
          : category == "All Categories"
          ? await supabase
              .from("products")
              .select()
              .neq("inventory", 0)
              .order("name", { ascending: true })
          : await supabase
              .from("products")
              .select()
              .eq("category", category)
              .neq("inventory", 0)
              .order("name", { ascending: true });
      setProducts(data || []);
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("category")
          .order("category", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        const uniqueCategories = [
          "All Categories",
          ...new Set(data.map((item) => item.category)),
        ];

        setCategoryArray(uniqueCategories);
        console.log(uniqueCategories);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [searchText, supabase, category]);

  return (
    <div className="mt-24 relative w-full">
      <div className="w-full fixed">
        <div className="default-margin flex gap-2 justify-between items-start">
          <div className="flex flex-col md:flex-row gap-2">
            <span className="w-40 md:w-64 flex items-center relative">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className="w-full border-2 rounded-md border-slate-400 px-2 py-1"
              ></input>
              <Image
                src={SearchIcon}
                width={24}
                height={24}
                alt=""
                className="absolute aspect-square right-2"
              />
            </span>
            <span className="w-40 md:w-64 flex flex-col items-start">
              <button
                onClick={() => setClickStatus(!clickStatus)}
                className="w-full h-10 relative bg-slate-400 border-2 hover:border-slate-600 px-2 rounded-md  shadow-md text-left z-10"
              >
                {category}
              </button>
              {clickStatus && (
                <span className="w-40 md:w-64 h-80 overflow-y-scroll absolute p-2 flex flex-col gap-1 mt-10 bg-slate-200 rounded-md border-slate-400 border-2 z-50">
                  {categoryArray.map((c) => (
                    <span
                      key={c}
                      className="cursor-pointer"
                      onClick={() => {
                        setCategory(c);
                        setClickStatus(false);
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </div>
          <Cart />
        </div>
      </div>
      <div className="default-margin default-height pt-24 md:pt-16">
        <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {products && products.length > 0 ? (
            products.map((product: any) => (
              <div key={product.id}>
                <ProductCard
                  image_url={product.image_url}
                  name={product.name}
                  price={product.price}
                  mrp={product.mrp}
                  category={product.category}
                  product={product}
                />
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
}
