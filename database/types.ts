import * as tables from ".";

type User = typeof tables.userTable.$inferSelect;
type Workspace = typeof tables.workspaceTable.$inferSelect;
type Profile = typeof tables.profileTable.$inferSelect;
type Session = typeof tables.sessionTable.$inferSelect;
type WorkspaceUser = typeof tables.workspaceUserTable.$inferSelect;
type Identity = typeof tables.identityTable.$inferSelect;

export type { User, Workspace, Profile, Session, WorkspaceUser, Identity };
