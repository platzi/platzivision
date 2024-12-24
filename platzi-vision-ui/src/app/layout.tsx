import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlatziVision",
  description: "PlatziVision es un asistente de IA para ayudarte a entender y visualizar imágenes.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
