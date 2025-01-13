import type { Metadata } from "next";
import { jersey } from "./ui/fonts";
import "./globals.css";



export const metadata: Metadata = {
  title: "Quizz App",
  description: "Built by houcem21 on github",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jersey.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
