import './globals.css';
import 'jbx/main.css';

import { GoogleAnalytics } from '@next/third-parties/google';

import GitHubCorner from '@/components/GitHubCorner.jsx';

const DESCRIPTION = 'Tool that can convert any image into a pure CSS image.';
const CANONICAL = 'https://javier.xyz/img2css';
const THUMBNAIL = 'https://javier.xyz/img2css/img2css.jpg';

// Absolute urls throughout: the canonical has to stay javier.xyz/img2css with no
// trailing slash, so nothing is left to url resolution.
export const metadata = {
  metadataBase: new URL('https://javier.xyz'),
  title: 'img2css | Convert any image to pure CSS',
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'img2css | Convert any image to pure CSS',
    description: DESCRIPTION,
    url: CANONICAL,
    images: [THUMBNAIL],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'img2css | Convert any image to pure CSS',
    description: DESCRIPTION,
    images: [THUMBNAIL],
  },
  appleWebApp: { capable: true },
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GitHubCorner />
        <GoogleAnalytics gaId="G-M2FT27FXS2" />
      </body>
    </html>
  );
}
