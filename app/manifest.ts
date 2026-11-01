import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kodedristi Software",
    short_name: "Kodedristi",
    description:
      "Premium software company in Nepal: custom software, web and mobile apps, SaaS, AI, outsourcing and IT courses.",
    start_url: "/",
    display: "browser",
    background_color: "#fafaf8",
    theme_color: "#2e3192",
    icons: [{ src: "/icon.png", type: "image/png", sizes: "any" }],
  };
}
