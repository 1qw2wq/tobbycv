import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Tobby Lv | Tactical & culinary Expert CV',
  description: 'Official portfolio website and downloadable CV profile of Tobby Lv — specializing in Tactical Presence, Non-Linguistic Studies, and Experimental Flavor Development.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F5F5F5] font-sans antialiased selection:bg-[#FF4500]/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
