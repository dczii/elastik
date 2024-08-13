"use client";
import { useEffect } from "react";
import type { Metadata } from "next";
import classNames from "classnames";
import { Inter } from "next/font/google";
import themes from "devextreme/ui/themes";

import "./globals.css";
import "devextreme/dist/css/dx.material.blue.dark.css";

const inter = Inter({ subsets: ["latin"] });

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
