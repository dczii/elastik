import type { Metadata } from "next";
import classNames from "classnames";
import { Inter } from "next/font/google";

import "./globals.css";
import "devextreme/dist/css/dx.material.blue.light.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={classNames(inter.className, "dx-viewport bg-no-repeat h-screen")}>
        {children}
      </body>
    </html>
  );
}
