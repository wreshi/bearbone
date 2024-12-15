"use client";

import * as React from "react";
import { Search, Home, Loader } from "lucide-react";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { UserButton } from "./user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { CommandContext } from "@/providers/command-provider";

interface AppSidebarProps {
  user: UserWithWorkspaceAndProfile;
  cookieselectedworkspaceid: string;
}

export function AppSidebar({
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadedPathnames, setLoadedPathnames] = React.useState<string[]>([]);
  const [loadingPathname, setLoadingPathname] = React.useState<string>("");
  const { user, cookieselectedworkspaceid: cookieSelectedWorkspaceId } = props;
  const router = useRouter();

  const { commandOpen, setCommandOpen } = React.useContext(CommandContext);

  // Create a ref to track if the component is mounted
  const isMounted = React.useRef(false);

  // Collect all routes that need to be prefetched
  const allRoutes: string[] = ["/app/home"];

  const prefetchAllRoutes = React.useCallback(() => {
    // Small delay to ensure we don't interfere with initial page load
    setTimeout(() => {
      allRoutes.forEach((route) => {
        if (route !== pathname) {
          router.prefetch(route);
        }
      });
      setLoading(false);
      if (loadedPathnames.length === 0) {
        setLoadedPathnames([pathname]);
      }
    }, 100);
  }, [router, allRoutes, pathname, loadedPathnames]);

  // Handle initial route prefetching
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      // Wait for the page to be fully loaded
      if (typeof window !== "undefined") {
        if (document.readyState === "complete") {
          prefetchAllRoutes();
        } else {
          window.addEventListener("load", prefetchAllRoutes);
          return () => window.removeEventListener("load", prefetchAllRoutes);
        }
      }
    }
  }, [prefetchAllRoutes]);

  const handleNavigation = (url: string) => () => {
    router.replace(url);
  };

  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className="">
      <SidebarHeader className="pt-4">
        <WorkspaceSwitcher
          workspaces={user.workspaces}
          cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-0.5">
          <SidebarMenu>
            <SidebarMenuItem className="">
              <SidebarMenuButton
                className="flex justify-between"
                onClick={() => {
                  setCommandOpen(!commandOpen);
                }}
              >
                <div className="flex items-center gap-2">
                  <Search className="size-4" />
                  <span>Search</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div
                onClick={handleNavigation("/app/home")}
                onDoubleClick={() => {
                  handleNavigation("/app/home");
                  toggleSidebar();
                }}
              >
                <SidebarMenuButton isActive={pathname === "/app/home"}>
                  <div className="flex items-center gap-2">
                    {loading && loadingPathname === "/app/home" ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      <Home className="size-4" />
                    )}
                    <span>Home</span>
                  </div>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
