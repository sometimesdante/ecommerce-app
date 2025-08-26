"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { handleDispatchWhatsapp } from "@/utils/functions/handleDispatchWhatsapp";

export default function OrderStatus({ id }: any) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickStatus, setClickStatus] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState();

  const [WaContact, setWaContact] = useState("");
  const [WaName, setWaName] = useState("");
  const [WaInvoice, setWaInvoice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .eq("id", id)
          .single();

        if (error) throw error;

        setWaContact(data.phone);
        setWaName(data.name);
        setWaInvoice(data.invoice_id);
        setDeliveryStatus(data.delivery_status);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, supabase, clickStatus]);

  async function UpdateDeliveryStatus(id: string, status: string) {
    const { error } = await supabase
      .from("transactions")
      .update({ delivery_status: status })
      .eq("id", id);
    console.log(error);

    if (status == "out for delivery" || "delivered") {
      handleDispatchWhatsapp(WaContact, WaName, WaInvoice);
    }

    setClickStatus(false);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <span className="w-40 flex flex-col items-start mx-2">
      <button
        onClick={() => setClickStatus(!clickStatus)}
        className="w-full h-10 relative bg-slate-400 border-2 px-2 rounded-md text-left z-10"
      >
        {deliveryStatus || "No status available"}
      </button>
      {clickStatus && (
        <span className="w-40 absolute p-2 flex flex-col gap-1 mt-10 bg-slate-100 rounded-md z-50">
          <span
            onClick={() => UpdateDeliveryStatus(id, "pending")}
            className="cursor-pointer py-2"
          >
            Pending
          </span>
          <hr />
          <span
            onClick={() => UpdateDeliveryStatus(id, "out for delivery")}
            className="cursor-pointer py-2"
          >
            Out for Delivery
          </span>
          <hr />
          <span
            onClick={() => UpdateDeliveryStatus(id, "delivered")}
            className="cursor-pointer py-2"
          >
            Delivered
          </span>
        </span>
      )}
    </span>
  );
}
