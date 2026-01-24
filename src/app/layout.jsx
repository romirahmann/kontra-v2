import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/admin/Provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "KONTRA",
  description:
    "Kontra Naratif. Web portal yang khusus menyajikan jurnalisme kritis, independen, dan investigatif dengan gaya yang segar dan relevan untuk generasi muda. Memberikan narasi tandingan terhadap isu sosial, politik, budaya, dan digital yang bias atau kurang dikupas di media lain. Menjadi platform opini, analisis dan jurnalisme data yang tegas, jujur, dan berani.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
