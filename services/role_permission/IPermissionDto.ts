export interface IPermissionDto {
  name: string;
  displayName: string;
  children: IPermissionDto[];
}
