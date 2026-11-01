import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EVENTORA — Every celebration deserves a perfect plan',
  description: 'GenAI-powered celebration and event planning. One intelligent workspace for weddings, birthdays and community celebrations.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23121316%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22serif%22 font-size=%2260%22 font-weight=%22bold%22 fill=%22%23B88E2F%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22>E</text></svg>',
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
      <body className="min-h-screen bg-paper-100 text-ink-900 font-sans selection:bg-gold-100 selection:text-ink-900">
        {children}
      </body>
    </html>
  );
}

