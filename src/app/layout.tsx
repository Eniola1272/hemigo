import type { Metadata, Viewport } from "next";
import { absoluteUrl, jsonLd, siteConfig } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s | Hemigo" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "ecommerce Nigeria",
    "online store Nigeria",
    "sell online",
    "Paystack storefront",
    "event tickets Nigeria",
    "preorder management",
    "small business commerce",
  ],
  authors: [{ name: "Hemigo", url: siteConfig.url }],
  creator: "Hemigo",
  publisher: "Hemigo",
  category: "ecommerce",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: siteConfig.icon,
    apple: siteConfig.icon,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.logo, width: 2172, height: 724, alt: "Hemigo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#4338ca",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: absoluteUrl(siteConfig.icon),
        email: process.env.CONTACT_EMAIL || "hello@hemigo.ng",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: process.env.CONTACT_EMAIL || "hello@hemigo.ng",
          areaServed: "NG",
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-NG",
      },
    ],
  };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
