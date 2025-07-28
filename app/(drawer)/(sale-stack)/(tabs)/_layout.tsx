import { IconType } from "@/enum/IconType";
import { MainNavigation, SaleManagerStack } from "@/enum/navigation/RouteName";
import {
  MainDrawerParamList,
  SaleManagerStackParamList,
} from "@/enum/navigation/RouteParam";
import SQLLiteQuery from "@/store/expo-sqlite/SQLLiteQuery";
import { useSaleManagerStackContext } from "@/store/react_context/SaleManagerStackProvide";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@rneui/base";
import { Badge, useTheme } from "@rneui/themed";
import { Tabs, useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

type SaleManagerTabNavigationProps = DrawerNavigationProp<
  MainDrawerParamList,
  MainNavigation.SALE_MANAGER_STACK
>;

export default function SaleTabsLayout() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const navigation = useNavigation<SaleManagerTabNavigationProps>();
  const { currentInvoice, isHideTabs } = useSaleManagerStackContext();
  const countProduct = currentInvoice?.countProduct ?? 0;

  const InitSQLLite_Database = async () => {
    SQLLiteQuery.InitDatabase(db);
  };

  useEffect(() => {
    InitSQLLite_Database();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: isHideTabs ? "none" : "flex" },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.greyOutline,
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: theme.colors.black,
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
        },
        headerTintColor: theme.colors.white, // màu của nút back và màu của tiêu đề
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 500,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon
              name="menu"
              size={24}
              style={{
                paddingLeft: 16,
              }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="temp-invoice"
        options={{
          tabBarLabel: "Hóa đơn tạm",
          title: "Danh sách hóa đơn tạm",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type={IconType.IONICON}
              name={focused ? "book-outline" : "book"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={({ navigation, route }) => ({
          title: `Thêm sản phẩm vào giỏ`,
          tabBarLabel: "Sản phẩm",
          tabBarIcon: ({ focused, color }) => (
            <Icon
              type={IconType.IONICON}
              name={focused ? "list" : "list-sharp"}
              color={color}
              size={24}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                padding: 16,
                position: "relative",
              }}
              onPress={() => {
                (
                  navigation as unknown as NativeStackNavigationProp<SaleManagerStackParamList>
                ).navigate(SaleManagerStack.TEMP_INVOICE_DETAIL);
              }}
            >
              {(countProduct ?? 0) > 0 && (
                <Badge
                  value={countProduct}
                  status="primary"
                  containerStyle={{
                    position: "absolute",
                    top: 10,
                  }}
                />
              )}
              <Icon
                name="shopping-basket"
                type={IconType.FONT_AWESOME_5}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Tabs>
  );
}
