import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IUserDto } from "@/services/user/IUserDto";
import UserService from "@/services/user/UserService";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Avatar, SearchBar, Text, useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PageUser() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [txtSearch, setTxtSearch] = useState("");
  const [users, setUsers] = useState<IUserDto[]>();

  const GetAllUser = async () => {
    const input: IPagedRequestDto = {
      maxResultCount: 20,
      skipCount: 0,
      keyword: "",
    };
    const data = await UserService.GetAllUser(input);
    if (data !== null) {
      setUsers([...data?.items]);
    }
  };

  useEffect(() => {
    GetAllUser();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchBar
        placeholder="Tìm kiếm người dùng"
        value={txtSearch}
        onChangeText={(text) => setTxtSearch(text)}
        containerStyle={{ backgroundColor: theme.colors.background }}
        inputContainerStyle={{
          backgroundColor: "white",
        }}
      />

      <ScrollView>
        {users?.map((item, index) => (
          <Pressable style={[styles.flexRow, styles.item]} key={item.id}>
            <Avatar
              rounded
              title={CommonFunc.getFirstLetter(item?.userName ?? "")}
              size="medium"
              containerStyle={[
                styles.avatarContainer,
                {
                  backgroundColor:
                    index % 4 === 1
                      ? theme.colors.softBlue_background
                      : index % 4 === 2
                      ? theme.colors.softOrange_background
                      : index % 4 === 3
                      ? theme.colors.softPink_background
                      : theme.colors.softTeal_background,
                },
              ]}
              titleStyle={{
                fontSize: 18,
                color:
                  index % 4 === 1
                    ? theme.colors.softBlue
                    : index % 4 === 2
                    ? theme.colors.softOrange
                    : index % 4 === 3
                    ? theme.colors.softPink
                    : theme.colors.softTeal,
              }}
            />
            <View style={styles.infoContainer}>
              <View style={{ gap: 12, justifyContent: "center" }}>
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  {item?.userName}
                </Text>
                <Text style={{ color: theme.colors.grey4, fontSize: 14 }}>
                  {item.emailAddress}
                </Text>
              </View>
              <View style={{ gap: 12, alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  {CommonFunc.remove_LastComma(
                    item?.roleNames ?? ""
                  ).toUpperCase()}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    item: {
      height: 80,
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.grey5,
      paddingTop: 10,
      paddingBottom: 10,
      marginLeft: 16,
      flex: 1,
    },
  });
