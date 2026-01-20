import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Grammaid",
  description: "Sistema de correção de redações em inglês usando LLMs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html >
  );
}
