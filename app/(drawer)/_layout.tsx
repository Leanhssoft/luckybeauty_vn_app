import Dropdown from "@/components/dropdown";
import { IconType } from "@/enum/IconType";
import { IChiNhanhBasicDto } from "@/services/chi_nhanh/ChiNhanhDto";
import ChiNhanhService from "@/services/chi_nhanh/ChiNhanhService";
import { ISelect } from "@/services/commonDto/ISelect";
import { useAppContext } from "@/store/react_context/AppProvider";
import { Theme } from "@rneui/base";
import { Icon, Image, Text, useTheme } from "@rneui/themed";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useRef, useState } from "react";
import { findNodeHandle, StyleSheet, UIManager, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// export const unstable_settings = {
//   drawer: {
//     drawerPosition: "left",
//   },
// };

// export const screenOptions = {
//   headerStyle: { backgroundColor: "#f8f8f8" },
//   headerTintColor: "#333",
//   drawerActiveTintColor: "#007aff",
// };

const HeaderRight = () => {
  const { theme } = useTheme();
  const styles = createStyle(theme);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const targetRef = useRef<View>(null);

  const { userLogin, chiNhanhCurrent, setChiNhanhCurrent } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [lstChiNhanhByUser, setListChiNhanhByUser] = useState<
    IChiNhanhBasicDto[]
  >([]);

  const GetListChiNhanhByUserLogin = async () => {
    const data = await ChiNhanhService.GetChiNhanhByUser();
    setListChiNhanhByUser([...data]);
  };

  useEffect(() => {
    GetListChiNhanhByUserLogin();
  }, []);

  const changeChiNhanh = (item: ISelect) => {
    setChiNhanhCurrent({ id: item.id, tenChiNhanh: item.text });
  };

  const showPopover = () => {
    if (targetRef.current) {
      targetRef.current.measureInWindow((x, y, width, height) => {
        setPosition({ x, y, width, height });
        setVisible(true);
      });
    }
  };
  const measurePosition = () => {
    const handle = findNodeHandle(targetRef.current);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setPosition({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const hidePopover = () => setVisible(false);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 16,
        gap: 4,
      }}
    >
      <Icon name="location-outline" type={IconType.IONICON} size={20} />
      <Dropdown
        options={lstChiNhanhByUser?.map((x) => {
          return { id: x.id, text: x.tenChiNhanh } as ISelect;
        })}
        itemSelected={{
          id: chiNhanhCurrent?.id ?? "",
          text: chiNhanhCurrent?.tenChiNhanh ?? "",
        }}
        onSelect={changeChiNhanh}
      />
      <Icon name="bell-outline" type={IconType.MATERIAL_COMMUNITY} size={20} />
    </View>
  );
};

const createStyle = (theme: Theme) =>
  StyleSheet.create({
    boxPopover: {
      flex: 1,
      paddingTop: 100,
      alignItems: "center",
    },
  });

export default function DrawerLayout() {
  const { theme } = useTheme();
  const { isLogin, isLoading } = useAppContext();

  if (isLoading) return null;
  if (!isLogin) return <Redirect href="/(auth)/login" />;

  function LogoTitle() {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "baseline",
          marginLeft: -10,
        }}
      >
        <Image
          source={require("../../assets/images/app-logo.png")}
          style={{ width: 30, height: 30 }}
        />
        <Text
          style={{ fontSize: 18, fontWeight: 600, color: theme.colors.primary }}
        >
          Lucky Beauty
        </Text>
      </View>
    );
  }

  // return <Slot />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#333",
          drawerActiveTintColor: "#007aff",
          headerTitleAlign: "left",
          headerRight: () => <HeaderRight />,
        }}
      >
        {/* Trang Customer */}
        <Drawer.Screen
          name="index"
          options={{
            // title: "Trang chủ",
            headerTitle: () => <LogoTitle />,
            drawerLabel: "Trang chủ",
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.IONICON}
                name={"home"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
        {/* Tab + Stack trong nhóm sale */}
        <Drawer.Screen
          name="(sale-stack)"
          options={{
            title: "Bán hàng",
            headerShown: false,
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.FOUNDATION}
                name={"burst-sale"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="(invoice-stack)"
          options={{
            headerShown: false,
            drawerLabel: "Hóa đơn",
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.FONT_AWESOME_5}
                name={"file-invoice"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="product/index"
          options={{
            title: "Sản phẩm",
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.IONICON}
                name={"list"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="(customers)"
          options={{
            headerShown: false,
            drawerLabel: "Khách hàng",
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.MATERIAL}
                name={"groups"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="(manager-system)"
          options={{
            headerShown: false,
            drawerLabel: "Quản trị",
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.MATERIAL}
                name={"manage-accounts"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
