import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://www.rishik-y.tech",
            changeFrequency: "monthly",
            priority: 1,
        },
    ];
}
