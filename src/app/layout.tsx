"use client";
import "./globals.css";
import { Metadata } from "next";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/common/site-header";
import { TailwindIndicator } from "@/components/common/tailwind-indicator";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupInterceptors } from "@/services/interceptors";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MuiThemeProviderSync } from "@/utils/mui-theme-sync-provider";
import { InterceptorInitializer } from "@/utils/interceptor-initializer";
import { RouteTracker } from "@/components/route-tracker/route-tracker";
import SearchBar from "@/components/tokenized-search/tokenized-search";
import { UserProfileProvider } from "@/hooks/UserProfileContext";

const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  setupInterceptors();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SessionProvider>
          <InterceptorInitializer />
          <QueryClientProvider client={queryClient}>
            <UserProfileProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <MuiThemeProviderSync>
                {isLoginPage ? (
                  <main className="flex min-h-screen items-center justify-center">
                    {children}
                  </main>
                ) : (
                  <SidebarProvider>
                    <AppSidebar />
                    <RouteTracker />
                    <div className="flex flex-col min-h-screen flex-1">
                      <SiteHeader></SiteHeader>
                      <main className="flex-1 mx-8 my-8">{children}</main>
                    </div>
                  </SidebarProvider>
                )}
                <TailwindIndicator />
              </MuiThemeProviderSync>
            </ThemeProvider>
            </UserProfileProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
