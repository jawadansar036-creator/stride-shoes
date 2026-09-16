import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { ClientShell } from '@/components/client-shell';

export const metadata: Metadata = {
  title: 'STRIDE | Premium Performance & Lifestyle Footwear',
  description: 'Shop marathon running shoes, Italian leather sneakers, trail runners, and court classics with our integrated RAG AI shopping assistant.',
  keywords: ['shoes', 'running shoes', 'sneakers', 'stride footwear', 'marathon shoes', 'rag ai shopping assistant'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 font-sans antialiased">
        <CartProvider>
          <ClientShell>{children}</ClientShell>
        </CartProvider>
      </body>
    </html>
  );
}
