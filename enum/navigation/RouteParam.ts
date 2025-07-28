import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackStackParamList = {
  LoginScreen: undefined;
};
export type RootStackParamList = {
  MainNavigation: NavigatorScreenParams<MainDrawerParamList>;
  LoginScreen: undefined;
  PageNotFound: undefined;
  Root: undefined;
};
export type MainDrawerParamList = {
  SaleManagerStack: NavigatorScreenParams<SaleManagerStackParamList>;
  Customer: undefined;
  Dashboard: undefined;
};

export type SaleManagerStackParamList = {
  SaleManagerTab: NavigatorScreenParams<SaleManagerTabParamList>;
  TempInvoiceDetails: undefined;
  ThanhToan: undefined;
};
export type SaleManagerTabParamList = {
  TempInvoice: undefined;
  Product: undefined;
};
