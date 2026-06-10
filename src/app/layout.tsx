import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reactiva - Catálogo Oficial de Insumos Médicos y Laboratorio",
  description: "Venta y distribución de insumos de laboratorio, material médico, EPP y papelería clínica en Concepción, Chiguayante. Más de 23 años de servicio y confianza.",
  keywords: ["insumos medicos", "laboratorio chile", "jeringas", "guantes latex", "epp", "reactivos", "reactiva cl", "marcos aldia"],
  openGraph: {
    title: "Reactiva - Catálogo de Insumos Médicos",
    description: "Distribución certificada de insumos médicos y de laboratorio en Chile.",
    type: "website",
    url: "https://reactiva.cl",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
