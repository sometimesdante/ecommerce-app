"use client";

import useCartStore from "@/store/cartStore";
import AddedCard from "@/ui/AddedCard";
import { Product, User } from "@/utils/types";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/functions/getCurrentUser";
import { handleCheckout } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { sendGAEvent } from "@next/third-parties/google";

export default function Checkout() {
  const supabase = createClient();
  const totalItems = useCartStore((state: any) => state.totalItems);
  const totalPrice = useCartStore((state: any) => state.totalPrice);
  const cart = useCartStore((state: any) => state.cart);

  const [userData, setUserData] = useState<User | null>(null);
  const [paymentMode, setPaymentMode] = useState("online");
  const [clickStatus, setClickStatus] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser(); // Call the getCurrentUser function
        setUserData(user); // Store all user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null); // Handle error by setting state to null or a fallback value
      }
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const { error } = await supabase.from("guest_profiles").insert({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as any,
        role: "guest",
        address: formData.get("address") as string,
      });
      if (error) {
        console.log("Error creating user", error);
      }

      handleCheckout(
        formData.get("name") as string,
        formData.get("email") as string,
        formData.get("address") as string,
        formData.get("phone") as any,
        paymentMode,
        cart,
        totalPrice
      );
      sendGAEvent("event", "buttonClicked", { value: "Order placed" });
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 pt-8 pb-24">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <h1 className="text-3xl">Your Cart</h1>
        <div className="flex flex-col gap-4 mb-12">
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

        <div>
          <label>Total Items:</label>
          <h3 className="mb-4">{totalItems}</h3>
          <label>Total Price:</label>
          <h3>₹{totalPrice}*</h3>
        </div>
      </div>
      <div>
        {totalPrice > 0 ? (
          userData?.name ? (
            <div>
              <h2 className="text-3xl mb-4">Confirm your details</h2>
              <div className="flex flex-col gap-8">
                <div>
                  <label>Customer Name:</label>
                  <h5>{userData?.name}</h5>
                </div>
                <div>
                  <label>Phone Number:</label>
                  <h5>{userData?.phone}</h5>
                </div>
                <div>
                  <label>Email:</label>
                  <h5>{userData?.email}</h5>
                </div>
                <div>
                  <label>Address:</label>
                  <h5>{userData?.address}</h5>
                </div>
                <div className="">
                  <label>Payment mode:</label>
                  <span className="w-56 mt-2 flex flex-col items-start">
                    <button
                      onClick={() => setClickStatus(!clickStatus)}
                      className="w-full h-10 relative bg-slate-200 border-2 hover:border-slate-600 px-2 rounded-md text-left z-10"
                    >
                      {paymentMode == "online"
                        ? "GPay/Credit/Debit Card"
                        : " Cash on Delivery"}
                    </button>
                    {clickStatus && (
                      <span className="w-56 absolute p-2 flex flex-col gap-1 mt-10 bg-slate-100 rounded-md z-50">
                        <span
                          onClick={() => {
                            setPaymentMode("online");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2"
                        >
                          GPay/Credit/Debit Card
                        </span>
                        <hr />
                        <span
                          onClick={() => {
                            setPaymentMode("cod");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2"
                        >
                          Cash on Delivery
                        </span>
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (
                    userData?.name &&
                    userData?.email &&
                    userData?.address &&
                    userData?.phone &&
                    cart &&
                    totalPrice
                  ) {
                    handleCheckout(
                      userData.name,
                      userData.email,
                      userData.address,
                      userData.phone,
                      paymentMode,
                      cart,
                      totalPrice
                    );
                    sendGAEvent("event", "buttonClicked", {
                      value: "Order placed",
                    });
                  } else {
                    console.error("Some details are missing");
                  }
                }}
                className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 mt-4 w-fit"
              >
                Place your order
              </button>
            </div>
          ) : (
            <div className="">
              <h2 className="text-3xl mb-4">Confirm your details</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <span className="flex flex-col gap-2">
                  <label className="ml-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="customer@mail.com"
                    required
                    className="border-2 px-2 py-1 w-fit"
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <label className="ml-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John Doe"
                    required
                    className="border-2 px-2 py-1 w-fit"
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <label className="ml-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="9176111222"
                    required
                    className="border-2 px-2 py-1 w-fit"
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <label className="ml-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="42 Wallaby Way, Sydney"
                    required
                    className="border-2 px-2 py-1 w-fit"
                  />
                </span>
                <div className="">
                  <label className="ml-2">Payment mode:</label>
                  <span className="w-56 mt-2 flex flex-col items-start">
                    <button
                      onClick={() => setClickStatus(!clickStatus)}
                      type="button"
                      className="w-full h-10 relative bg-slate-200 border-2 hover:border-slate-600 px-2 rounded-md text-left z-10"
                    >
                      {paymentMode == "online"
                        ? "GPay/Credit/Debit Card"
                        : " Cash on Delivery"}
                    </button>
                    {clickStatus && (
                      <span className="w-56 absolute p-2 flex flex-col gap-1 mt-10 bg-slate-100 rounded-md z-50">
                        <span
                          onClick={() => {
                            setPaymentMode("online");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2"
                        >
                          GPay/Credit/Debit Card
                        </span>
                        <hr />
                        <span
                          onClick={() => {
                            setPaymentMode("cod");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2"
                        >
                          Cash on Delivery
                        </span>
                      </span>
                    )}
                  </span>
                </div>
                <span className="flex gap-4">
                  <button
                    className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 w-fit mt-4"
                    type="submit"
                  >
                    Place your order
                  </button>
                </span>
              </form>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
