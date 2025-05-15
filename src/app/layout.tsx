
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StudentStay - Your Ideal Student Housing',
  description: 'Find the best PGs, flats, and rooms with AI-powered search using StudentStay.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background`}>
        <AuthProvider> {/* Wrap ThemeProvider and children with AuthProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
