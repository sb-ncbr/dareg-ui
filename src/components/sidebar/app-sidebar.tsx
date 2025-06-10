import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TypographySidebar } from "../typography/typography-sidebar";
import Link from "next/link";

const handleLogout = () => {
  signOut({ callbackUrl: "/login" });
};

export function AppSidebar() {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <img
            src="/ceitec_logo.png"
            alt="Logo"
            className="w-full rounded-full"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuItem onClick={() => router.push("/")}>
          <div className="flex items-center space-x-4">
            <LayoutDashboard className="h-8" />
            <TypographySidebar text="Dashboard" />
          </div>
        </SidebarMenuItem>
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
            <UserRound className="h-5 w-5 mr-6" />
            <TypographySidebar text="Profile" />
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
          <p className="text-sm text-muted-foreground">© 2023 Ceitec</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
