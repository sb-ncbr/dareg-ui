import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  CalendarClock,
  FileText,
  LayoutDashboard,
  LayoutPanelTop,
  Library,
  LogOutIcon,
  Settings,
  UserRound,
  Bookmark,
  Search,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TypographySidebar } from "../typography/typography-sidebar";
import Link from "next/link";
import Image from "next/image";
import daregLogo from "../../../public/dareg-logo.png";
import { useUserProfile } from "@/hooks/UserProfileContext";
import { SavedSearchesAccordion } from "../saved-searches/saved-searches-accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import {
  savedSearchesService,
  SavedSearch,
} from "@/services/saved-searches-service";

const handleLogout = () => {
  signOut({ callbackUrl: "/login" });
};

export function AppSidebar() {
  const router = useRouter();
  const profile = useUserProfile();
  const year = new Date().getFullYear();
  const { data: session, status } = useSession();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved searches on component mount
  useEffect(() => {
    const loadSavedSearches = async () => {
      try {
        setIsLoading(true);
        const searches = await savedSearchesService.getSavedSearches();
        setSavedSearches(searches);
      } catch (error) {
        console.error("Error loading saved searches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSearches();

    // Set up periodic refresh every 30 seconds to keep in sync
    const interval = setInterval(loadSavedSearches, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSavedSearchClick = (search: SavedSearch) => {
    // Navigate to the saved search URL
    if (search.url) {
      router.push(search.url);
    }
  };

  const handleDeleteSavedSearch = async (
    searchId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent triggering the search click
    try {
      const success = await savedSearchesService.deleteSavedSearch(searchId);
      if (success) {
        // Refresh the saved searches list
        await refreshSavedSearches();
      }
    } catch (error) {
      console.error("Error deleting saved search:", error);
    }
  };

  const refreshSavedSearches = async () => {
    try {
      setIsLoading(true);
      const searches = await savedSearchesService.getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error("Error refreshing saved searches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose refresh function globally for other components to use
  useEffect(() => {
    (window as any).refreshSidebarSearches = refreshSavedSearches;
    return () => {
      delete (window as any).refreshSidebarSearches;
    };
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Image
            onClick={() => router.push("/")}
            src={daregLogo}
            alt="Logo"
            className="p-4 opacity-90"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Collapsible
            defaultOpen={savedSearches.length > 0}
            className="group/collapsible"
          >
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="w-full cursor-pointer rounded-lg h-auto px-4 py-4 hover:bg-sidebar-accent transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <LayoutDashboard className="h-8" />
                  <TypographySidebar text="Dashboards" />
                  <div className="ml-auto flex items-center space-x-2">
                    {savedSearches.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {savedSearches.length} saved
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                  </div>
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            {savedSearches.length > 0 && (
              <CollapsibleContent>
                <SidebarGroupContent>
                  <div className="animate-in fade-in-0 duration-300 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
                    <SidebarMenu>
                      {isLoading ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Loading saved searches...
                        </div>
                      ) : (
                        savedSearches.map((search) => (
                          <SidebarMenuItem
                            key={search.id}
                            onClick={() => handleSavedSearchClick(search)}
                            className="flex items-center justify-between group/item hover:bg-sidebar-accent rounded-lg space-x-3"
                          >
                            <Search className="h-4 w-4" />
                            <span className="truncate text-sm">
                              {search.name}
                            </span>
                            <button
                              onClick={(e) =>
                                handleDeleteSavedSearch(search.id, e)
                              }
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700"
                              title="Delete saved search"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </SidebarMenuItem>
                        ))
                      )}
                    </SidebarMenu>
                  </div>
                </SidebarGroupContent>
              </CollapsibleContent>
            )}
          </Collapsible>
          {/* Dashboard navigation item */}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem onClick={() => router.push("/collections")}>
              <div className="flex items-center space-x-4">
                <Library className="h-7" />
                <TypographySidebar text="Collections" />
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem
              className=""
              onClick={() => router.push("/datasets")}
            >
              <div className="flex items-center space-x-4">
                <FileText />
                <TypographySidebar text="Datasets" />
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem onClick={() => router.push("/templates")}>
              <div className="flex items-center space-x-4">
                <LayoutPanelTop />
                <TypographySidebar text="Templates" />
              </div>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other Apps</SidebarGroupLabel>
          <SidebarGroupContent>
            <Link href="https://booking.ceitec.cz" passHref>
              <SidebarMenuItem>
                <div className="flex items-center space-x-4">
                  <CalendarClock />
                  <TypographySidebar text="Booking" />
                </div>
              </SidebarMenuItem>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem onClick={() => router.push("/profile")}>
          <div className="flex items-center">
            {profile?.avatar ? (
              <Image
                src={profile.avatar}
                alt="Profile Picture"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
            ) : (
              <UserRound className="h-5 w-5 mr-6" />
            )}
            <TypographySidebar text={session?.user?.name || "Profile"} />
          </div>
        </SidebarMenuItem>
        {/* <SidebarMenuItem onClick={() => router.push("/settings")}>
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-6" />
            <TypographySidebar text="Settings" />
          </div>
        </SidebarMenuItem> */}
        <SidebarMenuItem onClick={handleLogout}>
          <div className="flex items-center">
            <LogOutIcon className="h-5 w-5 mr-6" />
            <TypographySidebar text="Logout" />
          </div>
        </SidebarMenuItem>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            © {year}{" "}
            <a
              href="https://ceitec.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              CEITEC Masaryk University
            </a>
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
