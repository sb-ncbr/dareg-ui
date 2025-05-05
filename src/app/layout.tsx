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
import { setupInterceptors } from "@/app/services/interceptors";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

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
        <body
            className={cn(
                "min-h-screen bg-background font-sans antialiased"
            )}
        >
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {isLoginPage ? (
                        <main className="flex min-h-screen items-center justify-center">
                            {children}
                        </main>
                    ) : (
                        <SidebarProvider>
                            <AppSidebar />
                            <div className="flex flex-col min-h-screen flex-1">
                                <SiteHeader />
                                <SidebarTrigger />
                                <main className="flex-1 m-10">
                                    {children}
                                </main>
                            </div>
                        </SidebarProvider>
                    )}
                    <TailwindIndicator />
                </ThemeProvider>
            </QueryClientProvider>
        </SessionProvider>
        </body>
        </html>
    );
}