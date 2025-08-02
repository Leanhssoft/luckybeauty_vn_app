import { Input, Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PageEmpty from "@/components/page_empty";
import { IconType } from "@/enum/IconType";
import { LoaiChungTu, TenLoaiChungTu } from "@/enum/LoaiChungTu";
import { HoaDonDto, IHoaDonDto } from "@/services/hoadon/dto";
import SQLLiteQuery from "@/store/expo-sqlite/SQLLiteQuery";
import { useSaleManagerStackContext } from "@/store/react_context/SaleManagerStackProvide";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import CommonFunc from "../../../../utils/CommonFunc";

const TempInvoice = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const isFocused = useIsFocused();
  const route = useRouter();
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();

  const [lstHoaDon, setLstHoaDon] = useState<IHoaDonDto[]>([]);
  const [tabActive, setTabActive] = useState(LoaiChungTu.HOA_DON_BAN_LE);

  const arrTab = [
    {
      id: LoaiChungTu.HOA_DON_BAN_LE,
      text: "Hóa đơn",
    },
    {
      id: LoaiChungTu.GOI_DICH_VU,
      text: "Gói dịch vụ",
    },
  ];

  const getHoaDonFromCache = async (
    idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE
  ) => {
    const data = await SQLLiteQuery.GetListHoaDon_ByLoaiChungTu(
      db,
      idLoaiChungTu
    );
    setLstHoaDon([...data]);
  };

  useEffect(() => {
    getHoaDonFromCache();
  }, []);

  useEffect(() => {
    if (isFocused) {
      getHoaDonFromCache(tabActive);
    }
  }, [isFocused]);

  const createNewInvoice = async () => {
    const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
    const kiHieuMaChungTu =
      tabActive === LoaiChungTu.HOA_DON_BAN_LE
        ? TenLoaiChungTu.HOA_DON_BAN_LE
        : TenLoaiChungTu.GOI_DICH_VU;

    const newHD = new HoaDonDto({
      id: uuid.v4(),
      idLoaiChungTu: tabActive,
      maHoaDon: `${kiHieuMaChungTu} ${max}`,
    });

    //setLstHoaDon([newHD, ...lstHoaDon]);

    await SQLLiteQuery.HoaDon_ResetValueForColumn_isOpenLastest(db, tabActive);
    await SQLLiteQuery.InsertTo_HoaDon(db, newHD);

    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: newHD?.id,
      countProduct: 0,
      idLoaiChungTu: tabActive,
    });
    route.navigate("/product");
  };

  const onChangeTab = (tabActive: number) => {
    getHoaDonFromCache(tabActive);
    setTabActive(tabActive);
    setCurrentInvoice({
      ...currentInvoice,
      idLoaiChungTu: tabActive,
    });
  };

  const removeInvoice = async (id: string) => {
    await SQLLiteQuery.RemoveHoaDon_byId(db, id);
    setLstHoaDon(lstHoaDon?.filter((x) => x.id !== id));
  };

  const goInvoiceDetail = (item: IHoaDonDto) => {
    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: item.id,
    });
    //navigation.navigate(SaleManagerStack.TEMP_INVOICE_DETAIL);
  };

  const gotoEdit = async (item: IHoaDonDto) => {
    const lstCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(db, item.id);
    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: item.id,
      countProduct: lstCTHD?.length ?? 0,
    });
    route.navigate("/product");
  };
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {arrTab?.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.tabItem,
              tabActive === item.id
                ? styles.tabItemActive
                : styles.tabItemInActive,
            ]}
            onPress={() => onChangeTab(item.id)}
          >
            <Icon
              name="documents-outline"
              type={IconType.IONICON}
              size={18}
              color={
                tabActive === item.id ? theme.colors.white : theme.colors.black
              }
            />
            <Text
              style={{
                color:
                  tabActive === item.id
                    ? theme.colors.white
                    : theme.colors.black,
                fontWeight: 500,
              }}
            >
              {item.text}
            </Text>
          </Pressable>
        ))}
      </View>
      {lstHoaDon?.length === 0 ? (
        <PageEmpty
          txt={`Không có ${
            tabActive === LoaiChungTu.HOA_DON_BAN_LE
              ? "hóa đơn tạm"
              : "gói dịch vụ tạm"
          }`}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.white,
          }}
        >
          <Input
            leftIcon={{
              type: "ionicon",
              name: "search",
            }}
            placeholder="Tìm hóa đơn"
            containerStyle={styles.inputContainer}
            inputStyle={{
              fontSize: 14,
            }}
          />
          {lstHoaDon?.length > 0 && (
            <ScrollView>
              {lstHoaDon?.map((item, index) => (
                <Pressable
                  style={styles.itemInvoice}
                  key={index}
                  onPress={() => goInvoiceDetail(item)}
                >
                  <View
                    style={{
                      flex: 1,
                      gap: 15,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Icon
                      type="materialicon"
                      name="delete-outline"
                      size={24}
                      color={theme.colors.error}
                      style={{
                        flex: 1,
                      }}
                      onPress={() => removeInvoice(item?.id)}
                    />
                    <View style={styles.contentInvoice}>
                      <View
                        style={{
                          flex: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 500,
                            color: theme.colors.primary,
                          }}
                        >
                          {item?.maHoaDon}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.greyOutline,
                            fontSize: 14,
                          }}
                        >
                          {dayjs(item?.ngayLapHoaDon).format("HH:mm")}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 500,
                            textAlign: "right",
                            color: theme.colors.primary,
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(
                            item?.tongThanhToan ?? 0
                          )}
                        </Text>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={{
                            textAlign: "right",
                            color: theme.colors.greyOutline,
                          }}
                        >
                          {item?.tenKhachHang}
                        </Text>
                      </View>
                    </View>

                    <Icon
                      type="antdesign"
                      name="edit"
                      size={24}
                      style={{
                        flex: 1,
                      }}
                      onPress={() => gotoEdit(item)}
                    />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
        }}
        onPress={createNewInvoice}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            justifyContent: "center",
          }}
        >
          <Icon
            type={IconType.MATERIAL}
            name="add"
            color={theme.colors.primary}
            size={50}
          ></Icon>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default TempInvoice;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      padding: 8,
      position: "relative",
    },
    tabsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 8,
      backgroundColor: theme.colors.grey5,
      gap: 16,
    },
    tabItem: {
      gap: 8,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      flex: 1,
    },
    tabItemActive: {
      backgroundColor: theme.colors.primary,
    },
    tabItemInActive: {
      backgroundColor: theme.colors.disabled,
      borderColor: theme.colors.grey4,
      borderWidth: 1,
    },
    tabItemAdd: {
      backgroundColor: theme.colors.white,
    },
    itemInvoice: {
      backgroundColor: theme.colors.white,
      padding: 10,
      borderBottomColor: theme.colors.greyOutline,
      borderBottomWidth: 1,
    },
    contentInvoice: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 5,
    },
    inputContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: 4,
      borderColor: theme.colors.greyOutline,
    },
    buttonCreatNew: {
      borderRadius: 40,
    },
  });
