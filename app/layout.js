"use client"
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500"] });

// export const metadata = {
//   title: "Japa",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const pathName = usePathname()
  const googleAuthPaths = ['/login', "/signup"]
  const isAuthPage = googleAuthPaths.includes(pathName)
  return (
    <html lang="en">
      <head>
        <title>Japa</title>
      </head>
      {isAuthPage ? (
        <body className={`relative ${poppins.className}`}>
          <main className="">{children}</main>
        </body>
      ) : (
        <body className={`relative ${poppins.className}`}>
          <Header />
          <main className="">{children}</main>
          <Footer />
        </body>
      )}
    </html>
  );
}
