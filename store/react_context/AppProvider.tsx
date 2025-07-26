import { createContext, useContext, useEffect, useState } from 'react';
import LoginService from '../../services/login/LoginService';
import { IAuthenResultModel, ILoginInfo, ILoginModel } from '../../services/login/LoginDto';
import { IChiNhanhBasicDto } from '../../services/chi_nhanh/ChiNhanhDto';
import ChiNhanhService from '../../services/chi_nhanh/ChiNhanhService';
import UserService from '../../services/user/UserService';
import CommonFunc from '../../utils/CommonFunc';
import { IUserBasic } from '../../services/user/IUserBasic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStorage from '../AuthStorage';

type AppContextType = {
  isLoading: boolean;
  isLogin: boolean;
  userLogin: IUserBasic | null;
  login: (user: ILoginModel) => Promise<void>;
  logout: () => void;
  chiNhanhCurrent: IChiNhanhBasicDto | null;
  setChiNhanhCurrent: (chinhanh: IChiNhanhBasicDto) => void;
};
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userLogin, setUserLogin] = useState<IUserBasic | null>(null);
  const [chiNhanhCurrent, setChiNhanhCurrent] = useState<IChiNhanhBasicDto | null>(null);

  const checkLogin = async () => {
    const accessToken = await AuthStorage.getAccessToken();
    const expireAt = await AuthStorage.getExpireAt();
    if (accessToken && expireAt && Date.now() < expireAt) {
      setIsLogin(true);

      const userCache = await AuthStorage.getUserLogin();
      await SetInforUserLogin(userCache);
    } else {
      setIsLogin(false);
      await AuthStorage.clearToken();
    }
    setIsLoading(false);
  };

  const SetInforUserLogin = async (userName: string | null) => {
    if (userName) {
      let currentBrand: IChiNhanhBasicDto | null = null;
      const userInfor = await UserService.GetInforUser_ByUserName(userName);
      const chiNhanhOfUser = await ChiNhanhService.GetChiNhanhByUser();
      if (userInfor != null) {
        const idChiNhanhMacDinh = userInfor?.idChiNhanhMacDinh ?? '';
        if (!CommonFunc.checkNull_OrEmpty(idChiNhanhMacDinh)) {
          currentBrand = chiNhanhOfUser?.find(x => x.id === idChiNhanhMacDinh) ?? null;
        } else {
          currentBrand = chiNhanhOfUser[0];
        }
        setUserLogin({
          id: userInfor.id,
          userName: userInfor?.userName,
          userAvatar: userInfor?.userAvatar ?? '',
          emailAddress: userInfor?.emailAddress
        });
      }
      setChiNhanhCurrent({
        id: currentBrand?.id ?? '',
        tenChiNhanh: currentBrand?.tenChiNhanh ?? 'Default'
      });
    } else {
      setUserLogin(null);
      setChiNhanhCurrent(null);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = async (input: ILoginModel) => {
    const token: IAuthenResultModel | null = await LoginService.checkUserLogin(input, input?.tenantId ?? 0);
    if (!token || !token.accessToken) {
      setIsLogin(false);
      return;
    }
    setIsLogin(true);

    if (input.rememberClient) {
      await AuthStorage.saveToken(token);
      await AuthStorage.saveUserLogin(input.userNameOrEmailAddress);
    }
    await SetInforUserLogin(input.userNameOrEmailAddress);
    setIsLoading(false);
  };

  const logout = () => {
    AuthStorage.removeTokens();
    AuthStorage.removeUserLogin();
    setIsLogin(false);
  };
  return (
    <AppContext.Provider
      value={{
        isLogin: isLogin ?? false,
        isLoading,
        userLogin: userLogin,
        chiNhanhCurrent: chiNhanhCurrent,
        setChiNhanhCurrent,
        login,
        logout
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAuth must be used within an AppProvider');
  return context;
};
