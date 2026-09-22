import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sypra UI',
  description: 'Visual documentation for reusable React components.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
