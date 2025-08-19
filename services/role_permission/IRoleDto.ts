export interface IRoleDto {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  grantedPermissions?: string[];
}
