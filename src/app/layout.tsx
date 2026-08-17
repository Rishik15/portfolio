import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.rishik-y.tech"),

    title: "Rishik Yesgari | Software Engineer",

    description:
        "Portfolio of Rishik Yesgari, a software engineer building full-stack applications, AI and machine learning systems, and modern software solutions.",

    applicationName: "Rishik Yesgari",

    authors: [
        {
            name: "Rishik Yesgari",
            url: "https://www.rishik-y.tech",
        },
    ],

    creator: "Rishik Yesgari",
    publisher: "Rishik Yesgari",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        type: "profile",
        locale: "en_US",
        url: "/",
        siteName: "Rishik Yesgari",
        title: "Rishik Yesgari | Software Engineer",
        description:
            "Portfolio of Rishik Yesgari, a software engineer building full-stack applications, AI and machine learning systems, and modern software solutions.",
    },

    twitter: {
        card: "summary",
        title: "Rishik Yesgari | Software Engineer",
        description:
            "Portfolio of Rishik Yesgari, a software engineer building full-stack applications, AI and machine learning systems, and modern software solutions.",
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

const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://www.rishik-y.tech/#profile",
    url: "https://www.rishik-y.tech/",
    name: "Rishik Yesgari | Software Engineer",
    description:
        "Portfolio of Rishik Yesgari, a software engineer building full-stack applications, AI and machine learning systems, and modern software solutions.",
    mainEntity: {
        "@type": "Person",
        "@id": "https://www.rishik-y.tech/#person",
        name: "Rishik Yesgari",
        url: "https://www.rishik-y.tech/",
        jobTitle: "Software Engineer",
        description:
            "Software engineer building full-stack applications, AI and machine learning systems, and modern software solutions.",
        sameAs: [
            "https://github.com/Rishik15",
            "https://www.linkedin.com/in/rishikreddyyesgari",
        ],
    },
} as const;

type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} ${inter.variable} ${geistMono.variable} min-h-dvh antialiased`}
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                       __html: JSON.stringify(profileJsonLd).replace(
                            /</g,
                            "\\u003c",
                        ),
                    }}
                />

                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
