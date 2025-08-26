/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { enIN } from "date-fns/locale/en-IN";
import "react-datepicker/dist/react-datepicker.css";
import { createClient } from "@/utils/supabase/client";
import { endOfDay } from "date-fns";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { renderToString } from "react-dom/server";
import { Order } from "@/utils/types";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Template = ({
  ordersList,
  start,
  end,
}: {
  ordersList: Order[];
  start: string;
  end: string;
}) => {
  let totalAmount = 0;
  let totalTax = 0;

  for (const order of ordersList) {
    totalAmount += order.amount;
    totalTax += Array.isArray(order.products)
      ? order.products.reduce(
          (sum: number, item: any) =>
            sum + (Number(item.price) - Number(item.pretax)) * item.count,
          0
        )
      : 0;
  }

  return (
    <div className="h-full px-6">
      <div className="flex justify-between items-center mb-4">
        <span className="flex gap-4 items-center">
          <img
            src="https://www.ransanfarms.com/logo.jpeg"
            className="w-12 h-12"
            alt=""
          />
          <h4 className="font-semibold">
            Sales Report From {start.slice(3)} to {end.slice(3)}
          </h4>
        </span>
      </div>
      <div>
        <span className="flex items-start border-2 bg-white py-1 -mb-1">
          <p className="w-12 px-2 font-semibold">ID</p>
          <p className="w-44 px-1 font-semibold">Order Date</p>
          <p className="w-60 px-1 font-semibold">Customer Name</p>
          <p className="w-32 px-1 font-semibold">Phone</p>
          <p className="w-24 px-1 font-semibold">Tax</p>
          <p className="w-40 px-1 font-semibold">Order Amount</p>
        </span>
      </div>
      <div>
        {ordersList && ordersList.length > 0 ? (
          ordersList.map((order: any) => {
            return (
              <span
                key={order.id}
                className="flex items-start border-2 bg-white py-1 -mb-1"
              >
                <p className="w-12 px-2">{order.invoice_id}</p>
                <p className="w-44 px-1">
                  {format(
                    toZonedTime(order.created_at, "Asia/Kolkata"),
                    "dd-MM-yyyy"
                  )}
                </p>
                <p className="w-60 px-1">{order.name}</p>
                <p className="w-32 px-1">{order.phone}</p>
                <p className="w-24 px-1">
                  {order.products
                    .reduce(
                      (sum: number, item: any) =>
                        sum +
                        (Number(item.price) - Number(item.pretax)) * item.count,
                      0
                    )
                    .toFixed(2)}
                </p>
                <p className="w-40 px-1">{order.amount}</p>
              </span>
            );
          })
        ) : (
          <span className="flex items-start border-2 bg-white py-1 -mb-1">
            <p>No orders available</p>
          </span>
        )}
      </div>
      <div>
        <span className="flex items-start border-2 bg-white py-1 mt-4">
          <p className="w-12 px-2 font-semibold">Total</p>
          <p className="w-44 px-1"></p>
          <p className="w-60 px-1"></p>
          <p className="w-32 px-1"></p>
          <p className="w-24 px-1">{totalTax.toFixed(2)}</p>
          <p className="w-40 px-1">{totalAmount.toFixed(2)}</p>
        </span>
      </div>
    </div>
  );
};

export default function ExportOrders() {
  const [showFields, setShowFields] = useState(false);
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [errorMessage, setErrorMessage] = useState("");

  registerLocale("en-IN", enIN);
  setDefaultLocale("en-IN");

  const handleClick = () => {
    setErrorMessage("");
    setShowFields(!showFields);
  };

  async function generatePDF(data: any, start: string, end: string) {
    if (!Array.isArray(data)) {
      console.error("The given data is not an array", data);
      return;
    }

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
              <style>
                @media print {
                  @page {
                  size: A4;
                  margin: 8mm 0 4mm 0;
                  }
                }
              </style>
            </head>
            <body>
              ${renderToString(
                <Template ordersList={data} start={start} end={end} />
              )}
            </body>
          </html>
        `,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `OrdersList.pdf`;
      link.click();
    } else {
      console.error("Failed to generate PDF");
    }
  }

  async function handleExport() {
    const supabase = await createClient();

    try {
      if (startDate > endDate) {
        setErrorMessage("Error: Start date cannot be greater than end date");
        return;
      }
      if (endDate > currentDate) {
        setErrorMessage("Error: End date cannot be greater than today");
        return;
      }

      const startUTC = startDate.toISOString();
      const endUTC = endOfDay(endDate).toISOString();

      const { data: orders, error } = await supabase
        .from("transactions")
        .select()
        .order("created_at", { ascending: true })
        .gte("created_at", startUTC)
        .lt("created_at", endUTC)
        .neq("razorpay_id", "NULL");

      if (error) {
        throw error;
      }

      if (orders.length > 0) {
        setErrorMessage("");
        generatePDF(orders, startDate.toDateString(), endDate.toDateString());
        toast.success(
          "Please wait, your Products List is getting ready for download!",
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
        handleClick();
      } else {
        setErrorMessage(
          "There are no orders within the date range that you selected"
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred."
      );
    }
  }

  return (
    <span>
      <button
        onClick={handleClick}
        className="flex gap-2 items-center text-slate-200 bg-slate-600 rounded-md px-4 no-underline font-semibold py-2"
      >
        Export
      </button>
      {showFields && (
        <div className="fixed w-screen h-screen flex items-center justify-center bg-white/60 z-30 top-0 left-0 backdrop-blur-sm">
          <div className="relative mx-auto bg-white rounded-md shadow-md w-1/3 p-4">
            <h6 className="mb-4">Add new product</h6>
            <span className="flex flex-row items-center gap-2">
              <label className="w-24">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date: any) => setStartDate(date)}
                className="border-2 px-2 py-1 w-fit my-1"
              />
            </span>
            <span className="flex flex-row items-center gap-2">
              <label className="w-24">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date: any) => setEndDate(date)}
                className="border-2 px-2 py-1 w-fit my-1"
              />
            </span>
            <p className="my-4 text-red-400 font-semibold">{errorMessage}</p>
            <span className="flex gap-4 mt-4">
              <button
                onClick={handleExport}
                className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
              >
                Generate PDF
              </button>
              <button
                onClick={handleClick}
                className="bg-white text-slate-600 border-2 border-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
              >
                Close
              </button>
            </span>
          </div>
        </div>
      )}
    </span>
  );
}
