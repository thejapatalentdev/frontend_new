import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});
export const metadata = {
  title: "japa",
  description:
    "Discover the ultimate platform where we upskill, empower, and walk with you to your dream career",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`relative ${poppins.className}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
