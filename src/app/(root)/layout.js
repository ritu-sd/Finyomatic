import "../globals.css";
import { Providers } from "../../lib/utils/providers";

export const metadata = {
  title: "Finyomatic",
  description: "Your financial management app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
