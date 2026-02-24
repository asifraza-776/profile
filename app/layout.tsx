// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nevbar";
import Footer from "@/components/Footeer";
import SessionWrapper from "@/components/SessionWapper";
import { ToastContainer } from 'react-toastify'; // Add this
import 'react-toastify/dist/ReactToastify.css'; // Add this

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "get-me-a-chai",
  description: "this website is a chai lover's paradise",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white">
        <SessionWrapper>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          /> {/* Add ToastContainer here */}
        </SessionWrapper>
      </body>
    </html>
  );
}