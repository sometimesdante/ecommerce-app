import "@/styles/globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Ransan Farms and Foods",
  description: "Order organic whole-foods anywhere in Chennai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <ToastContainer />
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />
      </body>
    </html>
  );
}
