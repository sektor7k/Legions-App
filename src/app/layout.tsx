import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"


import "./globals.css";
import { Provider } from "./Provider";
import { ThemeProvider } from "@/components/theme-provider"
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "@/app/api/uploadthing/core";
// import { Wallet } from "@/context/WalletProvider";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Castrum Legions",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={cn(
            "min-h-screen font-sans antialiased dark",
            fontSans.variable
          )}
        >
          <div className="fixed inset-0 bg-background bg-cover bg-center"></div>
          <div className="relative z-10 min-h-screen">
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main>
                {/* <Wallet> */}
                  {children}
                {/* </Wallet> */}
              </main>
              <Toaster />
            </ThemeProvider>
          </div>
        </body>
      </Provider>
    </html>
  );
}
