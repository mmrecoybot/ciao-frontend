import "@/app/globals.css";
export const metadata = {
  title: "Ciao Mobile",
  description: "Developed by Declives Corporation Ltd.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
