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
  InvoiceStack: NavigatorScreenParams<InvoiceStackParamList>;
  Customer: undefined;
  Dashboard: undefined;
  Product: undefined;
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
export type InvoiceStackParamList = {
  Invoices: undefined;
  ServicePackage: undefined;
  ValueCard: undefined;
};
