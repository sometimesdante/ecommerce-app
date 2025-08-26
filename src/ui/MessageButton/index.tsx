"use client";
import { handleWhatsapp } from "@/utils/functions/handleWhatsapp";
import { createClient } from "@/utils/supabase/client";

// import { handleWhatsapp } from "@/utils/functions/handleWhatsapp";

// export default function MessageButton() {
//   return (
//     <button
//       className="w-40 h-10 bg-slate-200 border-2 hover:border-slate-600 px-2 rounded-md text-left"
//       onClick={() =>
//         handleWhatsapp("9176053332", "Lalith", "#124242", "tomorrow")
//       }
//     >
//       Test Button
//     </button>
//   );
// }

export default function MessageButton() {
  const supabase = createClient();

  async function handleClick() {
    const { data: orders } = await supabase
      .from("transactions")
      .select()
      .eq("transaction_id", "M1mMlfJBekgf61lqubmLT");

    console.log(orders?.[0]);
    const order = orders?.[0];

    // Trigger whatsapp notification
    console.log(order?.phone, order?.name, order?.invoice_id);
    await handleWhatsapp(
      order?.phone,
      order?.name,
      order?.invoice_id,
      "tomorrow"
    );
  }

  return (
    <button
      className="w-40 h-10 bg-slate-200 border-2 hover:border-slate-600 px-2 rounded-md text-left"
      onClick={() => handleClick()}
    >
      Test Button
    </button>
  );
}
