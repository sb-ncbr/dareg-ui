import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/common/main-nav";
import { Icons } from "@/components/common/icons";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import SearchBar from "../tokenized-search/tokenized-search";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b px-5">
      <div className="container flex w-full items-center space-x-4 justify-between sm:justify-between sm:space-x-0 sm:min-w-full">
        <SidebarTrigger></SidebarTrigger>
        <div className="flex-1 flex justify-center items-center min-w-0">
          <SearchBar />
        </div>
        <div className="flex flex-1 items-center w-full justify-end">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
