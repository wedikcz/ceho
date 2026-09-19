import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Sora, Instrument_Sans } from 'next/font/google';
import './globals.css';
import AccessibilityBar from '@/components/AccessibilityBar';
import EmergencyBanner from '@/components/EmergencyBanner';
import Navbar from '@/components/Navbar';
import LiveStatusBar from '@/components/LiveStatusBar';
import Footer from '@/components/Footer';

const sora = Sora({
  subsets: ['latin-ext'],
  variable: '--font-sora',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin-ext'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

// Dynamic import for heavy AI Anička Chat widget to optimize initial bundle & FCP
const AnickaChat = dynamic(() => import('@/components/AnickaChat'));

export const metadata: Metadata = {
  title: 'Obec Čehovice Online 2027 • Oficiální digitální portál',
  description:
    'Oficiální digitální portál obce Čehovice u Prostějova s AI asistentkou Aničkou, bezpečnostním jádrem Titan, úřední deskou a digitální podatelnou.',
  openGraph: {
    title: 'Obec Čehovice Online 2027 • Oficiální digitální portál',
    description:
      'Oficiální digitální portál obce Čehovice u Prostějova s AI asistentkou Aničkou, bezpečnostním jádrem Titan a WCAG 2.2 AA přístupností.',
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://cehovice.cz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Obec Čehovice Online 2027',
    description: 'Oficiální digitální portál obce Čehovice s AI asistentkou Aničkou a jádrem Titan.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Structured Data JSON-LD for GovernmentOrganization / Municipality
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Obec Čehovice',
    url: 'https://cehovice.cz',
    logo: 'https://cehovice.cz/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Čehovice 80',
      addressLocality: 'Čehovice',
      postalCode: '798 17',
      addressCountry: 'CZ',
    },
    telephone: '+420 582 373 723',
    email: 'obec@cehovice.cz',
    founder: {
      '@type': 'Person',
      name: 'Milan Smékal',
      jobTitle: 'Starosta obce',
    },
    knowsAbout: [
      'Úřední deska',
      'Digitální podatelna',
      'Svoz odpadu',
      'Místní poplatky',
      'Hasiči SDH Čehovice',
    ],
  };

  return (
    <html lang="cs" className={`scroll-smooth ${sora.variable} ${instrumentSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#060d17" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#060d17] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-black font-body">
        {/* Top Accessibility Settings Bar (High-Contrast & Font Scaling) */}
        <AccessibilityBar />

        {/* Emergency & Municipal Radio Banner */}
        <EmergencyBanner />

        {/* Primary Navbar */}
        <Navbar />

        {/* Live Weather & Status Bar */}
        <LiveStatusBar />

        {/* Dynamic Route Content */}
        <main className="flex-1">{children}</main>

        {/* Consolidated Legal & Partner Footer */}
        <Footer />

        {/* Floating AI Anička Assistant Widget */}
        <AnickaChat />
      </body>
    </html>
  );
}
