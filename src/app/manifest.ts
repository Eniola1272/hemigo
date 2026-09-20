import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hemigo — Commerce for launches, shops and events",
    short_name: "Hemigo",
    description:
      "Launch products, sell online, collect payments and manage fulfillment.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4338ca",
    icons: [
      {
        src: "/brand/hemigo-icon.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
