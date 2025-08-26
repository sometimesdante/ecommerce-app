"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CustomOrder } from "@/utils/types";
import { renderToString } from "react-dom/server";
import { ToWords } from "to-words";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span>No items</span>;
  }

  return (
    <span>
      {products.map((item: any) => (
        <span key={item.id} className="w-full flex justify-between">
          <p className="w-64">{item.name}</p>
          <p className="w-24 px-1">{item.count}</p>
          <p className="w-32 px-1">{item.mrp}</p>
          <p className="w-32 px-1">{item.pretax}</p>
          <p className="w-32 px-1">{item.tax}</p>
          <p className="w-32 px-1">
            {((Number(item.price) - Number(item.pretax)) * item.count).toFixed(
              2
            )}
          </p>
          <p className="w-32 px-1">{item.price * item.count}</p>
        </span>
      ))}
    </span>
  );
}

const Template = ({ transaction }: { transaction: CustomOrder | null }) => {
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-12 pb-6">
      <div className="">
        <h3 className="font-semibold text-xl">
          Invoice Bill No. {transaction?.invoice_id}
        </h3>
        <div className="flex flex-row">
          <div className="w-1/2">
            <h5>Sold by:</h5>
            <p className="font-semibold text-lg">RanSan Farms and Foods</p>
            <p className="mt-4">
              <span className="font-semibold">GST Number:</span> 33ABIFR6754P1ZG
            </p>
            <p>
              <span className="font-semibold">PAN Number:</span> ABIFR6754P
            </p>
            <p>
              <span className="font-semibold">FSSAI Number:</span>{" "}
              22424046000152
            </p>
            <p>
              <span className="font-semibold">Phone:</span> +91 9944495911
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              sales@ransanfarms.com
            </p>
            <p>
              <span className="font-semibold">Address:</span>
              <br />
              Block A-704, Alaka Palazzo,
              <br />
              7th Floor, Poonamallee High Road,
              <br />
              Kattupakkam, Tiruvallur, TN, 600056
            </p>
          </div>
        </div>
        <div className="my-6">
          <span className="w-full flex justify-between mb-2">
            <p className="w-64 font-semibold">Name</p>
            <p className="w-24 px-1 font-semibold">Qty</p>
            <p className="w-32 px-1 font-semibold">MRP</p>
            <p className="w-32 px-1 font-semibold">Unit Price</p>
            <p className="w-32 px-1 font-semibold">Tax Rate</p>
            <p className="w-32 px-1 font-semibold">Tax Amt</p>
            <p className="w-32 px-1 font-semibold">Total Amt</p>
          </span>
          <span className="my-4">
            <OrderItems products={transaction?.products} />
          </span>
          <span className="my-4">
            <p className="mt-4">
              <span className="font-semibold">Item Quantity</span>{" "}
              {transaction?.products.reduce(
                (sum: number, num: any) => sum + num.count,
                0
              )}
            </p>
            <p className="flex justify-between">
              <span>
                <span className="font-semibold">Sum Total: </span>
                Rs. {transaction?.amount}*{" "}
              </span>
            </p>
            <p className="mt-4">
              <span className="font-semibold">Amount in words</span>{" "}
              {transaction?.amount && toWords.convert(transaction?.amount)}
            </p>
          </span>
        </div>
      </div>
      <div>
        <h4 className="w-full text-center">
          Thank you for your order, please visit again!
        </h4>
      </div>
    </div>
  );
};

export default function CustomInvoice() {
  const [showFields, setShowFields] = useState(false);

  const supabase = createClient();
  const handleClick = () => {
    setShowFields(!showFields);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const data = {
      invoiceNumber: formData.get("invoice") as string,
      amount: formData.get("amount") as string,
    };

    const transaction = {
      created_at: "",
      invoice_id: Number(data.invoiceNumber),
      transaction_id: "MANUAL",
      payment_status: "cod",
      razorpay_id: "Not Applicable",
      delivery_status: "pending",
      address: "Chennai",
      amount: Number(data.amount),
      products: [
        {
          id: 999,
          created_at: "2024-12-02T17:51:29.037654+00:00",
          name: "Miscellaneous",
          category: "Others",
          image_url: "",
          mrp: 0,
          pretax: 0,
          tax: 0,
          price: 0,
          inventory: 0,
          purchase: 0,
          count: 1,
        },
      ],
    };

    try {
      const { error } = await supabase.from("transactions").insert([
        {
          invoice_id: transaction.invoice_id,
          transaction_id: transaction.transaction_id,
          payment_status: transaction.payment_status,
          razorpay_id: transaction.razorpay_id,
          delivery_status: transaction.delivery_status,
          amount: transaction.amount,
          address: transaction.address,
          products: transaction.products,
        },
      ]);
      if (error) {
        console.error("Error creating transaction:", error);
      } else {
        await generatePDF(transaction);
        toast.success(
          "Please wait, your Invoice is getting ready for download!",
          {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          }
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      handleClick();
    }
  }

  async function generatePDF(transactionData: CustomOrder) {
    const response = await fetch("https://www.ransanfarms.com/api/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        htmlContent: `
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
              ${renderToString(<Template transaction={transactionData} />)}
            </body>
          </html>
        `,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice No.${transactionData.invoice_id}.pdf`;
      link.click();
    } else {
      console.error("Failed to generate PDF");
    }
  }

  return (
    <span>
      <button
        onClick={handleClick}
        className="flex gap-2 items-center text-slate-600 bg-slate-200 border-2 border-slate-600 rounded-md px-4 no-underline font-semibold py-2"
      >
        Custom Invoice
      </button>
      {showFields && (
        <div className="fixed w-screen h-screen flex items-center justify-center bg-white/60 z-30 top-0 left-0 backdrop-blur-sm">
          <div className="relative mx-auto bg-white rounded-md shadow-md w-1/3 p-4">
            <form onSubmit={handleSubmit}>
              <h6 className="mb-4">Create Custom Invoice</h6>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-24">Invoice No.</label>
                <input
                  type="text"
                  name="invoice"
                  id="invoice"
                  placeholder="Enter Invoice Number"
                  className="border-2 px-2 py-1 w-fit"
                  required
                />
              </span>
              <span className="flex flex-row items-center gap-2 mb-2">
                <label className="w-24">Amount</label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  placeholder="Enter Invoice Amount"
                  className="border-2 px-2 py-1 w-fit"
                  required
                />
              </span>
              <span className="flex gap-4 mt-4">
                <button
                  onClick={handleClick}
                  className="bg-white text-slate-600 border-2 border-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
                >
                  Generate PDF
                </button>
              </span>
            </form>
          </div>
        </div>
      )}
    </span>
  );
}
