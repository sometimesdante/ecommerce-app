"use client";

import { useEffect, useState } from "react";
import { User } from "@/utils/types";
import { getCurrentUser } from "@/utils/functions/getCurrentUser";
import { updateCurrentUser } from "@/utils/functions/updateCurrentUser";

export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [showFields, setShowFields] = useState(false);

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

  const handleClick = () => {
    setShowFields(!showFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await updateCurrentUser(formData);
      // Optionally, you could refetch user data or update state here if needed
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div>
      <span className="w-full flex justify-between">
        <h1 className="text-3xl">Your Profile</h1>
        <button onClick={handleClick} className="underline underline-offset-4">
          Edit
        </button>
      </span>
      {showFields && (
        <div className="w-1/4">
          <form onSubmit={handleSubmit}>
            <span className="flex flex-col gap-2">
              <label>Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                className="border-2 px-2 py-1 w-fit"
              />
            </span>
            <span className="flex flex-col gap-2">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="9176111222"
                className="border-2 px-2 py-1 w-fit"
              />
            </span>
            <span className="flex flex-col gap-2">
              <label>Address</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="42 Wallaby Way, Sydney"
                className="border-2 px-2 py-1 w-fit"
              />
            </span>
            <span className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="customer@mail.com"
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
            </span>
          </form>
        </div>
      )}
      <div className="flex flex-col mt-8 gap-4">
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
      </div>
    </div>
  );
}
