import Dropdown from "@/components/dropdown";
import { IconType } from "@/enum/IconType";
import { IChiNhanhBasicDto } from "@/services/chi_nhanh/ChiNhanhDto";
import ChiNhanhService from "@/services/chi_nhanh/ChiNhanhService";
import { ISelect } from "@/services/commonDto/ISelect";
import { useAppContext } from "@/store/react_context/AppProvider";
import { Avatar, Icon, useTheme } from "@rneui/themed";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CommonFunc from "../../utils/CommonFunc";

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
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", paddingRight: 16 }}
    >
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

      <Avatar
        size={32}
        rounded
        containerStyle={{ backgroundColor: theme.colors.greyOutline }}
        // source={userLogin?.userAvatar ? { uri: userLogin?.userAvatar } : {}}
        title={
          CommonFunc.checkNull(userLogin?.userAvatar ?? "")
            ? CommonFunc.getFirstLetter(userLogin?.userName)
            : ""
        }
      />
    </View>
  );
};

export default function DrawerLayout() {
  const { theme } = useTheme();
  const { isLogin, isLoading } = useAppContext();

  if (isLoading) return null;
  if (!isLogin) return <Redirect href="/(auth)/login" />;

  // return <Slot />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#333",
          drawerActiveTintColor: "#007aff",
          headerRight: () => <HeaderRight />,
        }}
      >
        {/* Trang Customer */}
        <Drawer.Screen
          name="index"
          options={{
            title: "Trang chủ",
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
          name="customer/index"
          options={{
            title: "Khách hàng",
            drawerIcon: ({ focused, color, size }) => (
              <Icon
                type={IconType.FONT_AWESOME_5}
                name={"user-friends"}
                color={focused ? theme.colors.primary : theme.colors.disabled}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
