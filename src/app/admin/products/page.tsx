"use client";

import AddProduct from "@/ui/AddProduct";
import EditProduct from "@/ui/EditProduct";
import ExportProducts from "@/ui/ExportProducts";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";

export default function ProductsDashboard() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select()
      .order("id", { ascending: true });
    setProducts(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <span className="w-full flex justify-start gap-4 mb-8">
        <h1 className="text-3xl">Products Dashboard</h1>
        <span className="flex gap-4">
          <ExportProducts />
          <AddProduct />
        </span>
      </span>
      <div>
        <div className="flex mb-2">
          <span className="w-12 border-2 px-1 font-semibold">ID</span>
          <span className="w-72 border-2 px-1 font-semibold">Name</span>
          <span className="w-40 border-2 px-1 font-semibold">Category</span>
          <span className="w-24 border-2 px-1 font-semibold">PP</span>
          <span className="w-24 border-2 px-1 font-semibold">MRP</span>
          <span className="w-24 border-2 px-1 font-semibold">Special</span>
          <span className="w-24 border-2 px-1 font-semibold">Tax</span>
          <span className="w-40 border-2 px-1 font-semibold">Price</span>
          <span className="w-24 border-2 px-1 font-semibold">Inventory</span>
          <span className="w-16"></span>
        </div>
        {products && products.length > 0 ? (
          products.map((product: Product) => (
            <div key={product?.id} className="flex">
              <span className="w-12 border-2 px-1">{product.id}</span>
              <span className="w-72 border-2 px-1">{product.name}</span>
              <span className="w-40 border-2 px-1">{product.category}</span>
              <span className="w-24 border-2 px-1">{product.purchase}</span>
              <span className="w-24 border-2 px-1">{product.mrp}</span>
              <span className="w-24 border-2 px-1">{product.pretax}</span>
              <span className="w-24 border-2 px-1">{product.tax}</span>
              <span className="w-40 border-2 px-1">{product.price}</span>
              <span className="w-24 border-2 px-1">{product.inventory}</span>
              <EditProduct id={product?.id} onProductUpdate={fetchProducts} />
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
}
