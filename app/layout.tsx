import "./globals.css";

export const metadata = {
  title: "Thirunavukkarasy E",
  description: "Web Developer And Web Designer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
