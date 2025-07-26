export interface ILoginInfo {
  userName: string;
  tenantName: string;
  tenantId?: number;
}
export interface ILoginModel {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
  tenantId?: number;
}
export interface IAuthenResultModel {
  accessToken: string;
  refreshToken: string;
  expireInSeconds: boolean;
}

export interface IUserLoginDto {
  userName: string;
  idChiNhanh: string;
}
