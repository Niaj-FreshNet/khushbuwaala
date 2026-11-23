import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api", "/cart", "/checkout", "/thank-you", "/orders", "/my-account", "/wishlist", "/login", "/sign-up"],
        },
        sitemap: "https://khushbuwaala.com/sitemap.xml",
    };
}
