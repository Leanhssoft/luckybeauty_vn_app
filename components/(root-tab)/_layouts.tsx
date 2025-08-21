import HeaderRight from "@/components/layout/header-right";
import { IconType } from "@/enum/IconType";
import { useAppContext } from "@/store/react_context/AppProvider";
import { Icon, useTheme } from "@rneui/themed";
import { Tabs } from "expo-router";

export default function RootTabs() {
  const { theme } = useTheme();
  const { chiNhanhCurrent } = useAppContext();
  return (
    <Tabs
      screenOptions={() => ({
        headerTitle: () => <HeaderRight />,
      })}
    >
      <Tabs.Screen
        options={({}) => ({
          tabBarLabel: "Tổng quan",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type={IconType.IONICON}
              name={"home"}
              color={focused ? theme.colors.primary : theme.colors.disabled}
            />
          ),
        })}
      />
      <Tabs.Screen
        options={({}) => ({
          tabBarLabel: "Lịch hẹn",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type={IconType.IONICON}
              name={"calendar-outline"}
              color={focused ? theme.colors.primary : theme.colors.disabled}
              size={24}
            />
          ),
        })}
      />
      <Tabs.Screen
        name="temp-invoice"
        options={({}) => ({
          tabBarLabel: "Bán hàng",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type={IconType.MATERIAL_COMMUNITY}
              name={"sale-outline"}
              color={focused ? theme.colors.primary : theme.colors.disabled}
              size={24}
            />
          ),
        })}
      />
      <Tabs.Screen
        options={({}) => ({
          tabBarLabel: "Khách hàng",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type={IconType.MATERIAL}
              name={"contact-mail"}
              color={focused ? theme.colors.primary : theme.colors.disabled}
              size={24}
            />
          ),
        })}
      />
      <Tabs.Screen
        options={({}) => ({
          tabBarLabel: "Mục khác",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type={IconType.IONICON}
              name={"apps-outline"}
              color={focused ? theme.colors.primary : theme.colors.disabled}
              size={24}
            />
          ),
        })}
      />
    </Tabs>
  );
}
