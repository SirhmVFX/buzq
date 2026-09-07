import type { Metadata } from "next";
import { Geist_Mono, Lato, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Buzq — Know the second something breaks",
    template: "%s · Buzq",
  },
  description:
    "Drop an API call in your success and error blocks. Watch signups, payments, and failures land in Slack-like channels your whole team can live in.",
  openGraph: {
    title: "Buzq — Know the second something breaks",
    description:
      "Realtime product pulse for startups, founders, and engineering teams. Event chat that looks and feels like Slack.",
    type: "website",
    siteName: "Buzq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buzq — Know the second something breaks",
    description: "Realtime ops chat for your product. Instrument success and failure paths in one line.",
  },
};

const themeBoot = `try{var t=localStorage.getItem('buzq-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${lato.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
