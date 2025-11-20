import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AgriTechChatbot from "./component/Chatbot";
import Navbar from "./component/Navber";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AgriSense",
  description: "Agentic Ai and IOT integrated farm dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="pt-24">
        {children}
          <AgriTechChatbot />
        </div>
      </body>
    </html>
  );
}
