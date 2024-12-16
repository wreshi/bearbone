"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { CommandContext } from "@/providers/command-provider";
import {
  Book,
  Headset,
  Loader,
  LogOut,
  LucideIcon,
  MessageSquareText,
  Settings,
  Home,
  CreditCard,
  Palette,
  User,
} from "lucide-react";
import { signInUrl } from "@/constants";
import { signOutAction } from "@/server/sign-out";
import { useServerAction } from "zsa-react";

interface CommandLink {
  label: string;
  url: string;
  icon: LucideIcon;
  group: "navigation" | "help" | "account";
}

const commandLinks: CommandLink[] = [
  {
    label: "Go to Account Settings",
    url: "/app/settings/account",
    icon: User,
    group: "navigation",
  },
  {
    label: "Go to Workspace Settings",
    url: "/app/settings/workspace",
    icon: Settings,
    group: "navigation",
  },
  {
    label: "Go to Billing Settings",
    url: "/app/settings/billing",
    icon: CreditCard,
    group: "navigation",
  },
  {
    label: "Go to Appearance Settings",
    url: "/app/settings/appearance",
    icon: Palette,
    group: "navigation",
  },
  {
    label: "Go to Home",
    url: "/app/home",
    icon: Home,
    group: "navigation",
  },
  {
    label: "Contact Support",
    url: "/reach/support",
    icon: Headset,
    group: "help",
  },
  {
    label: "Give Feedback",
    url: "/reach/feedback",
    icon: MessageSquareText,
    group: "help",
  },
  {
    label: "Read Documentation",
    url: "#",
    icon: Book,
    group: "help",
  },
];

interface CommandLinkProps {
  url?: string;
  label: string;
  Icon: LucideIcon;
  onClick: () => void;
}

function CommandLink({ url, label, Icon, onClick }: CommandLinkProps) {
  return (
    <CommandItem className="flex gap-2" onSelect={onClick}>
      <Icon className="size-6 rounded-md border p-1" />
      <span>{label}</span>
    </CommandItem>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = React.useContext(CommandContext);
  const { execute: executeSignOut } = useServerAction(signOutAction);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleCommand = React.useCallback(
    (command: () => void) => {
      setCommandOpen(false);
      command();
    },
    [setCommandOpen],
  );

  const handleSignOut = React.useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const response = await executeSignOut();
      if (!response) {
        toast.error("Unable to logout");
        return;
      }
      router.replace(signInUrl);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Internal error occurred");
    } finally {
      setIsLoggingOut(false);
    }
  }, [executeSignOut, router]);

  const navigationItems = React.useMemo(
    () => commandLinks.filter((link) => link.group === "navigation"),
    [],
  );

  const helpItems = React.useMemo(
    () => commandLinks.filter((link) => link.group === "help"),
    [],
  );

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogTitle className="sr-only">Command Menu</DialogTitle>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No Results Found</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((link) => (
            <CommandLink
              key={link.label}
              url={link.url}
              label={link.label}
              Icon={link.icon}
              onClick={() => handleCommand(() => router.push(link.url))}
            />
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        <CommandGroup heading="Help">
          {helpItems.map((link) => (
            <CommandLink
              key={link.label}
              url={link.url}
              label={link.label}
              Icon={link.icon}
              onClick={() => handleCommand(() => router.push(link.url))}
            />
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        <CommandGroup heading="Account">
          <CommandLink
            label={isLoggingOut ? "Logging out..." : "Log out"}
            Icon={isLoggingOut ? Loader : LogOut}
            onClick={() => handleCommand(handleSignOut)}
          />
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
