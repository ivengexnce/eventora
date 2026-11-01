import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EVENTORA — Every celebration deserves a perfect plan',
  description: 'GenAI-powered celebration and event planning. One intelligent workspace for weddings, birthdays and community celebrations.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ivory-50 text-charcoal-900 font-sans selection:bg-terracotta-100 selection:text-terracotta-800">
        {children}
      </body>
    </html>
  );
}

