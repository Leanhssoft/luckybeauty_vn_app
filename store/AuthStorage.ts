import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAuthenResultModel, ILoginInfo, ILoginModel } from '../services/login/LoginDto';
const STORAGE_KEY_LOGIN = 'user_login';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRE_AT_KEY = 'access_token_expire_at';

const expiresIn = 86400; // tương đương TimeSpan.FromDays(1)

class AuthStorage {
  saveToken = async (input: IAuthenResultModel) => {
    try {
      const expireAt = Date.now() + expiresIn * 1000;
      const ops: [string, string][] = [
        [ACCESS_TOKEN_KEY, input.accessToken],
        [EXPIRE_AT_KEY, expireAt.toString()]
      ];

      if (input.refreshToken) {
        ops.push([REFRESH_TOKEN_KEY, input.refreshToken]);
      }

      await AsyncStorage.multiSet(ops);
    } catch (error) {
      console.error('error get token', error);
    }
  };
  getAccessToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  };

  getRefreshToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  };

  getExpireAt = async (): Promise<number | null> => {
    const value = await AsyncStorage.getItem(EXPIRE_AT_KEY);
    return value ? parseInt(value, 10) : null;
  };

  isTokenValid = async (): Promise<boolean> => {
    const expireAt = await this.getExpireAt();
    return expireAt ? Date.now() < expireAt : false;
  };

  removeTokens = async (): Promise<void> => {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, EXPIRE_AT_KEY]);
  };

  clearToken = async (): Promise<void> => {
    await this.removeTokens();
  };
  saveUserLogin = async (userLogin: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LOGIN, userLogin);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin đăng nhập:', error);
    }
  };
  getUserLogin = async (): Promise<string | null> => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY_LOGIN);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đăng nhập:', error);
      return null;
    }
  };
  removeUserLogin = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_LOGIN);
    } catch (error) {
      console.error('Lỗi khi xoá thông tin đăng nhập:', error);
    }
  };
}

export default new AuthStorage();
