import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import {MainNav} from "@/components/common/main-nav";
import {Icons} from "@/components/common/icons";
import {ThemeToggle} from "@/components/common/theme-toggle";

export function SiteHeader() {
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b px-10">
            <div className="container flex h-16 w-full items-center space-x-4 sm:justify-between sm:space-x-0 sm:min-w-full">
                <MainNav items={siteConfig.mainNav} />
                <div className="flex flex-1 items-center w-full justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}