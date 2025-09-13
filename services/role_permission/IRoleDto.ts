import { IUserBasic } from "../user/IUserBasic";

export interface IRoleDto {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  grantedPermissions?: string[];
  users?: IUserBasic[];
}
