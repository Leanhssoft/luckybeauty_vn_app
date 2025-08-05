import api from "../api";
import { IUserDto } from "./IUserDto";

class UserService {
  getUser_byId = async (userId: number): Promise<IUserDto | null> => {
    try {
      const result = await api.get(`api/services/app/User/Get?Id=${userId}`);
      return result;
    } catch (error) {
      console.log(`getUser_byId ${error}`);
      return null;
    }
  };
  GetInforUser_ByUserName = async (
    userName: string
  ): Promise<IUserDto | null> => {
    try {
      const result = await api.get(
        `api/services/app/User/GetInforUser_ByUserName?userName=${userName}`
      );
      return result.data.result;
    } catch (error) {
      return {
        id: 1,
        userName: "admin",
      } as IUserDto;
    }
  };
  checkMatchesPassword = async (
    userId: number,
    plainPassword: string
  ): Promise<boolean> => {
    try {
      const result = await api.get(
        `api/services/app/User/CheckMatchesPassword?userId=${userId}&plainPassword=${plainPassword}`
      );
      return result;
    } catch (error) {
      return false;
    }
  };
  changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<IUserDto | null> => {
    try {
      const result = await api.post(
        `api/services/app/UserProfile/changeUserPassword`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );
      return result;
    } catch (error) {
      console.log(`changeUserPassword ${error}`);
      return null;
    }
  };
  UpdateProfile = async (user: IUserDto): Promise<IUserDto | null> => {
    try {
      const result = await api.post(
        `api/services/app/UserProfile/UpdateProfile`,
        user
      );
      return result;
    } catch (error) {
      console.log(`UpdateProfile ${error}`);
      return null;
    }
  };
}
export default new UserService();
