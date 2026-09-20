export const siteConfig = {
  name: "Hemigo",
  title: "Hemigo — Commerce for launches, shops and events",
  description:
    "Create a storefront, launch products, sell tickets, collect payments and manage fulfillment from one calm commerce platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  logo: "/brand/hemigo-logo.png",
  icon: "/brand/hemigo-icon.png",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
