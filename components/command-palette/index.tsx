"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "../ui/dialog";
import { CommandContext } from "@/providers/command-provider";
import { GoToLink } from "./commands/go-to";
import { Book, Headset, LucideIcon, MessageSquareText } from "lucide-react";
import { CustomIconLink } from "./commands/custom-icon";
import { SignOutCommand } from "./commands/sign-out";

interface CommandLink {
  title: string;
  url: string;
}

interface CustomLogoLink {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SwitchPanelCommandProps {
  panel: string;
  PanelIcon: LucideIcon;
}

interface CommandData {
  gotoLinks: CommandLink[];
  helpLinks: CustomLogoLink[];
}

const commandsData: CommandData = {
  gotoLinks: [
    { title: "Account Settings", url: "/app/settings/account" },
    { title: "Workspace Settings", url: "/app/settings/workspace" },
    { title: "Billing Settings", url: "/app/settings/billing" },
    { title: "Appearance Settings", url: "/app/settings/appearance" },
    { title: "Home", url: "/app/home" },
  ],
  helpLinks: [
    { title: "Contact Support", url: "/reach/support", icon: Headset },
    { title: "Give Feedback", url: "/reach/feedback", icon: MessageSquareText },
    { title: "Read Documentation", url: "#", icon: Book },
  ],
};

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = React.useContext(CommandContext);

  const runCommand = (command: () => void) => {
    setCommandOpen(false);
    command();
  };

  return (
    <>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogTitle className="sr-only text-center text-lg">
          Command Menu
        </DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>
          <CommandGroup heading="Navigation">
            {commandsData.gotoLinks.map((link) => (
              <GoToLink
                key={link.title}
                {...link}
                runCommandAction={runCommand}
              />
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Help">
            {commandsData.helpLinks.map((link) => (
              <CustomIconLink
                Icon={link.icon}
                key={link.title}
                {...link}
                runCommandAction={runCommand}
              />
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Account">
            <SignOutCommand runCommandAction={runCommand} />
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
