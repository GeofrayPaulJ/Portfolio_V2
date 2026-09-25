import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Geofray Paul J | AI Engineer, Medical Imaging & MLOps",
  description:
    "AI engineer in medical imaging: segmentation and classification, computational pathology and neuroimaging, and the infrastructure that trains and serves the models.",
  keywords: [
    "AI Engineer",
    "Medical Imaging",
    "MLOps",
    "Deep Learning",
    "nnU-Net",
    "CUDA",
    "DGX A100",
    "Computational Pathology",
    "Geofray Paul J",
  ],
  authors: [{ name: "Geofray Paul J" }],
  openGraph: {
    title: "Geofray Paul J, AI Engineer",
    description:
      "AI engineer in medical imaging: segmentation and classification, computational pathology and neuroimaging, and the infrastructure that trains and serves the models.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geofray Paul J, AI Engineer",
    description:
      "AI engineer in medical imaging: segmentation and classification, computational pathology and neuroimaging, and the infrastructure that trains and serves the models.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col font-sans selection:bg-sky-500/30 selection:text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="print:hidden">
            <Navbar />
          </div>
          <main className="flex-1">
            {children}
          </main>
          <div className="print:hidden">
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
