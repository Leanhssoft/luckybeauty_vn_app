import { IRoleDto } from "@/services/role_permission/IRoleDto";
import RoleService from "@/services/role_permission/RoleService";
import { Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Permission() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [roleInfor, setRoleInfor] = useState<IRoleDto>();

  const getInforRole_byId = async () => {
    const data = await RoleService.GetRoleForEdit(parseInt(id));
    if (data) {
      setRoleInfor(data);
    }
  };

  useEffect(() => {
    getInforRole_byId();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text>Quyen</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
