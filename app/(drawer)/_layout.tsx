import Popover from "@/components/_popover";
import { IconType } from "@/enum/IconType";
import { IChiNhanhBasicDto } from "@/services/chi_nhanh/ChiNhanhDto";
import ChiNhanhService from "@/services/chi_nhanh/ChiNhanhService";
import { useAppContext } from "@/store/react_context/AppProvider";
import { DrawerContextProvider } from "@/store/react_context/DrawerContextProvider";
import { Theme } from "@rneui/base";
import { Icon, Image, Text, useTheme } from "@rneui/themed";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const appLogo = require("../../assets/images/app-logo.png");

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

  const changeChiNhanh = (item: IChiNhanhBasicDto) => {
    setChiNhanhCurrent({ id: item.id, tenChiNhanh: item.tenChiNhanh });
    setVisible(false);
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
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setPosition({ x, y, width, height });
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 16,
      }}
      ref={targetRef}
      onLayout={measurePosition}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        onPress={showPopover}
      >
        <Icon name="location-outline" type={IconType.IONICON} size={18} />
        <Text>{chiNhanhCurrent?.tenChiNhanh}</Text>
        <Icon name="chevron-down" type={IconType.IONICON} size={14} />
      </TouchableOpacity>
      <Popover
        visible={visible}
        onClose={() => setVisible(false)}
        position={position}
        POPUP_WIDTH={150}
      >
        <View>
          {lstChiNhanhByUser?.map((x) => (
            <TouchableOpacity
              style={{ padding: 8 }}
              key={x.id}
              onPress={() => changeChiNhanh(x)}
            >
              <Text
                style={{
                  color:
                    x.id === chiNhanhCurrent?.id
                      ? theme.colors.primary
                      : theme.colors.black,
                }}
              >
                {x.tenChiNhanh}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Popover>
      <Icon name="bell-outline" type={IconType.MATERIAL_COMMUNITY} size={18} />
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

function LogoTitle() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "baseline",
        marginLeft: -10,
      }}
    >
      <Image source={appLogo} style={{ width: 30, height: 30 }} />
      <Text
        style={{ fontSize: 18, fontWeight: 600, color: theme.colors.primary }}
      >
        Lucky Beauty
      </Text>
    </View>
  );
}

export default function DrawerLayout() {
  const { theme } = useTheme();
  const { isLogin, isLoading } = useAppContext();

  if (isLoading) return null;
  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return (
    <DrawerContextProvider>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
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
            drawerLabel: "Sản phẩm",
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
    </DrawerContextProvider>
  );
}
