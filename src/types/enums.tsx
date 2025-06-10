const enum ViewModes {
  New = "new",
  Edit = "edit",
  View = "view",
}

export { ViewModes };

export type PermissionModes = "owner" | "editor" | "viewer";

export const PERMISSION_MODES: PermissionModes[] = [
  "owner",
  "editor",
  "viewer",
];
