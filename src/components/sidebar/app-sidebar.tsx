import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenuItem,
} from "@/components/ui/sidebar"


export function AppSidebar() {
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
                {/*<SidebarMenu>*/}
                {/*    <SidebarMenuItem>*/}
                {/*        <DropdownMenu>*/}
                {/*            <DropdownMenuTrigger asChild>*/}
                {/*                <SidebarMenuButton>*/}
                {/*                    <User2 /> Username*/}
                {/*                    <ChevronUp className="ml-auto" />*/}
                {/*                </SidebarMenuButton>*/}
                {/*            </DropdownMenuTrigger>*/}
                {/*            <DropdownMenuContent*/}
                {/*                side="top"*/}
                {/*                className="w-[--radix-popper-anchor-width]"*/}
                {/*            >*/}
                {/*                <DropdownMenuItem>*/}
                {/*                    <span>Account</span>*/}
                {/*                </DropdownMenuItem>*/}
                {/*                <DropdownMenuItem>*/}
                {/*                    <span>Billing</span>*/}
                {/*                </DropdownMenuItem>*/}
                {/*                <DropdownMenuItem>*/}
                {/*                    <span>Sign out</span>*/}
                {/*                </DropdownMenuItem>*/}
                {/*            </DropdownMenuContent>*/}
                {/*        </DropdownMenu>*/}
                {/*    </SidebarMenuItem>*/}
                {/*</SidebarMenu>*/}
                <SidebarGroup>
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <a href="/projects">Projects</a>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <a href="/datasets">Datasets</a>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <a href="/templates">Templates</a>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Profile</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <a href="/profile">Profile</a>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuItem>
                    <a href="/settings" className="text-sm text-primary">
                        Settings
                    </a>
                </SidebarMenuItem>
                <div className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">© 2023 Ceitec</p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
