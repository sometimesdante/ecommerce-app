"use client";
import { useState } from "react";
import Link from "next/link";

export default function DashboardClient() {
  const [loading, setLoading] = useState(false);

  const sendWhatsappMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/handleWhatsapp", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert("WhatsApp message sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      alert("Error sending message.");
    }
    setLoading(false);
  };

  return (
    <div className="">
      <h1 className="text-3xl">Dashboard</h1>
      <div className="flex flex-col gap-4 my-8">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/products">Products</Link>
        <button onClick={sendWhatsappMessage} disabled={loading}>
          {loading ? "Sending..." : "Send WhatsApp"}
        </button>
      </div>
    </div>
  );
}
