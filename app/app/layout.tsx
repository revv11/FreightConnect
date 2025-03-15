import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { UserContextProvider } from "./context/UserContext";
import AuthContext from "./context/AuthContext";



export const metadata: Metadata = {
  title: "FreightConnect",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
      <AuthContext>
        <UserContextProvider>
          <Toaster position="top-right" />
          {children}
        </UserContextProvider>
      </AuthContext>
      </body>
    </html>
  );
}
