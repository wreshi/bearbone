"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Workspace } from "@/database/types";
import { toast } from "sonner";
import { useRouter } from "@/hooks/use-performance-router";
import { Skeleton } from "@/components/ui/skeleton";
import { setSelectedWorkspaceAction } from "@/server/workspaces";
import { useServerAction } from "zsa-react";
import { cn } from "@/utils/tailwind";
import { decryptFromBase64URI } from "@/utils";

export function WorkspaceSwitcher({
  workspaces,
  cookieSelectedWorkspaceId,
}: {
  workspaces: Workspace[];
  cookieSelectedWorkspaceId: string;
}) {
  const decodedWorkspaceId = decryptFromBase64URI(cookieSelectedWorkspaceId);

  const { isMobile, open: isSidebarOpen } = useSidebar();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
    React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState<Workspace | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { execute } = useServerAction(setSelectedWorkspaceAction);

  React.useEffect(() => {
    const workspaceLogic = async () => {
      const previouslySelectedWorkspace = workspaces.find(
        (ws) => ws.id === decodedWorkspaceId,
      );

      if (!previouslySelectedWorkspace) {
        const firstWorkspaceInArray = workspaces[0];
        await execute({ workspaceId: firstWorkspaceInArray.id });
        setSelectedWorkspace(firstWorkspaceInArray);
      } else {
        setSelectedWorkspace(previouslySelectedWorkspace);
      }

      setLoading(false);
    };

    const res = workspaceLogic();
  }, [workspaces, decodedWorkspaceId, execute]);

  if (loading) {
    return (
      <>
        {isSidebarOpen ? (
          <div className="flex w-full items-center justify-between px-2">
            <div className="flex items-center">
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="ml-auto size-4 rounded" />
          </div>
        ) : (
          <Skeleton className="h-8 w-8" />
        )}
      </>
    );
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isSidebarOpen || isMobile ? (
              <SidebarMenuButton
                className={cn(
                  "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mx-1 mb-0 w-[97%] rounded-lg border px-3 py-4",
                )}
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {selectedWorkspace?.name}
                  </span>
                  {/* <span className="truncate text-xs">{"Free Plan"}</span> */}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            ) : (
              <Avatar className="h-8 w-8 rounded-lg border">
                <AvatarImage src={""} alt={selectedWorkspace?.name ?? ""} />
                <AvatarFallback className="rounded-lg bg-transparent font-medium">
                  {selectedWorkspace?.name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={async () => {
                  setSelectedWorkspace(workspace);
                  const response = await execute({ workspaceId: workspace.id });
                  if (!response) {
                    toast.error("Unable to change workspace");
                  }
                  setOpen(false);
                }}
                className={cn("gap-2 p-2")}
              >
                {workspace.name}
                <DropdownMenuShortcut>
                  ⌘{workspaces.indexOf(workspace) + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowNewWorkspaceDialog(true)}
              className="cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* <Dialog
        open={showNewWorkspaceDialog}
        onOpenChange={setShowNewWorkspaceDialog}
      >
        <DialogContent className="p-5">
          New workspace form goes here
        </DialogContent>
      </Dialog> */}
    </SidebarMenu>
  );
}
