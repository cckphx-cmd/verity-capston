import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Business Intelligence Suite | Courtney Kingsbury",
  description: "AI-powered document analysis and business intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#8B7355',
                border: '1px solid #DDD5CC',
                padding: '16px',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#8B7355',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
