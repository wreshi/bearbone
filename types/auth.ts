import { Profile, User, Workspace } from "@/database/types";

export interface UserWithWorkspaceAndProfile extends User {
  workspaces: Workspace[];
  profile: Profile;
}

export interface DealStage {
  stage: string;
  color: string;
}

export interface AccountStatus {
  status: string;
  color: string;
}

export interface WorkspaceWithChooseables extends Workspace {
  dealStages: DealStage[];
  accountStatuses: AccountStatus[];
}

export type ActivityType = "call" | "message" | "comment" | "email" | undefined;
