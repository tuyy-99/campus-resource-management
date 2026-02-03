import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Nav } from '@/components/layout/Nav';
import { ToastProvider } from "@/components/ui/Toast";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Campus Resource Management",
  description: "Manage and request campus resources",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <Nav />
            <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
