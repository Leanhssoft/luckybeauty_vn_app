import { CheckBox, Theme } from "@rneui/base";
import { Icon, SearchBar, Text, useTheme } from "@rneui/themed";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  default as Reanimated,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import BottomButtonAdd from "@/components/_bottom_button_add";
import { TextLink } from "@/components/_text_link";
import { ActionBottomNew } from "@/components/action_bottom_delete";
import PageEmpty from "@/components/page_empty";
import { IconType } from "@/enum/IconType";
import { LoaiChungTu, TenLoaiChungTu } from "@/enum/LoaiChungTu";
import { HoaDonDto, IHoaDonDto } from "@/services/hoadon/dto";
import SQLLiteQuery from "@/store/expo-sqlite/SQLLiteQuery";
import { useSaleManagerStackContext } from "@/store/react_context/SaleManagerStackProvide";
import { useBottomTabSaleStore } from "@/store/zustand/bottom_tab_sale";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import uuid from "react-native-uuid";
import CommonFunc from "../../../../utils/CommonFunc";

const TempInvoice = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const isFocused = useIsFocused();
  const route = useRouter();
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const openRef = useRef<SwipeableMethods | null>(null);
  const setIsHideBottomTab = useBottomTabSaleStore((s) => s.setIsHideTab);
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();
  const [isShowBoxSearch, setIsShowBoxSearch] = useState<boolean>(false);
  const [isChoseMultiple, setChoseMultiple] = useState<boolean>(false);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

  const [arrIdHoaDonChosed, setArrIdHoaDonChosed] = useState<string[]>([]);
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

    await SQLLiteQuery.HoaDon_ResetValueForColumn_isOpenLastest(db, tabActive);
    await SQLLiteQuery.InsertTo_HoaDon(db, newHD);

    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: newHD?.id,
      countProduct: 0,
      idLoaiChungTu: tabActive,
    });
    route.navigate("../(tabs)/product");
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
  const removeMultipleInvoices = async () => {
    await SQLLiteQuery.Remove_MultipleHoaDon(db, arrIdHoaDonChosed);
    setLstHoaDon(lstHoaDon?.filter((x) => !arrIdHoaDonChosed.includes(x.id)));
    setChoseMultiple(false);
    setIsHideBottomTab(false);
    setArrIdHoaDonChosed([]);
  };

  const goInvoiceDetail = (item: IHoaDonDto) => {
    if (isChoseMultiple) {
      setArrIdHoaDonChosed((prev) => {
        if (prev.includes(item.id)) return prev.filter((x) => x !== item.id);
        else return [item.id, ...prev];
      });
    } else {
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: item.id,
      });
      route.navigate("/(drawer)/(sale-stack)/temp_invoice_details");
    }
  };

  const onChangeChoseMultiple = () => {
    setChoseMultiple(!isChoseMultiple);
    setIsHideBottomTab(!isChoseMultiple);

    if (isChoseMultiple) {
      setArrIdHoaDonChosed([]);
    }
  };
  const onChangeCheckAll = () => {
    setIsCheckAll(!isCheckAll);
    if (isCheckAll) {
      setArrIdHoaDonChosed([]);
    } else {
      setArrIdHoaDonChosed(
        lstHoaDon?.map((x) => {
          return x.id;
        })
      );
    }
  };

  const gotoEdit = async (item: IHoaDonDto) => {
    const lstCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(db, item.id);
    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: item.id,
      countProduct: lstCTHD?.length ?? 0,
    });
    route.navigate("/(drawer)/(sale-stack)/(tabs)/product");
  };

  function RightAction(
    progress: SharedValue<number>,
    drag: SharedValue<number>,
    item: IHoaDonDto
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 80 }],
      };
    }, []);

    return (
      <Reanimated.View style={[styleAnimation]}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: theme.colors.error,
              width: 80,
              height: "100%",
              justifyContent: "center",
              gap: 8,
            },
          ]}
          onPress={() => removeInvoice(item.id)}
        >
          <Icon
            name="delete"
            type={IconType.MATERIAL_COMMUNITY}
            color={theme.colors.white}
            size={18}
          />
          <Text style={{ color: theme.colors.white, textAlign: "center" }}>
            Xóa
          </Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

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
          style={{ height: 100 }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.white,
          }}
        >
          <SearchBar
            placeholder="Tìm kiếm hóa đơn"
            containerStyle={{
              backgroundColor: theme.colors.white,
              borderBottomColor: theme.colors.grey5,
              borderBottomWidth: 1,
            }}
            inputContainerStyle={{
              backgroundColor: theme.colors.white,
            }}
            // value={txtd}
            // onChangeText={(txt) => setTextSearch(txt)}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
            }}
          >
            <View>
              <TextLink
                lable={isChoseMultiple ? "Bỏ chọn nhiều" : "Chọn nhiều hóa đơn"}
                onPress={onChangeChoseMultiple}
              />
            </View>
            {isChoseMultiple && (
              <TextLink
                lable={isCheckAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                onPress={onChangeCheckAll}
              />
            )}
          </View>

          {lstHoaDon?.length > 0 && (
            <ScrollView style={{ paddingHorizontal: 8 }}>
              {lstHoaDon?.map((item, index) => (
                <Swipeable
                  key={item?.id}
                  containerStyle={{
                    overflow: "hidden",
                    paddingVertical: 12,
                    borderBottomColor: theme.colors.grey5,
                    borderBottomWidth: 1,
                  }}
                  renderRightActions={(progress, drag) =>
                    RightAction(progress, drag, item)
                  }
                  onSwipeableOpen={() => {
                    if (
                      openRef.current &&
                      openRef.current !== swipeableRef.current
                    ) {
                      openRef.current.close();
                    }
                    openRef.current = swipeableRef.current;
                  }}
                  ref={swipeableRef}
                  onSwipeableClose={() => {
                    if (openRef.current === swipeableRef.current) {
                      openRef.current = null;
                    }
                  }}
                >
                  <Pressable
                    style={[
                      styles.flexRow,
                      {
                        justifyContent: "space-between",
                      },
                    ]}
                    onPress={() => goInvoiceDetail(item)}
                  >
                    <View style={[styles.flexRow, { gap: 8 }]}>
                      {isChoseMultiple && (
                        <CheckBox
                          checked={arrIdHoaDonChosed?.includes(item.id)}
                          containerStyle={{ padding: 0, margin: 0 }}
                        />
                      )}
                      <View style={{ gap: 4 }}>
                        <Text
                          style={{
                            fontWeight: 500,
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
                    </View>
                    <View style={[styles.flexRow, { gap: 8 }]}>
                      <View style={{ gap: 4 }}>
                        <Text
                          style={{
                            fontWeight: 500,
                          }}
                        >
                          {CommonFunc.formatCurrency(item?.tongThanhToan ?? 0)}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.greyOutline,
                            fontSize: 14,
                          }}
                        >
                          {item?.tenKhachHang}
                        </Text>
                      </View>
                      {!isChoseMultiple && (
                        <Icon
                          iconStyle={{ color: theme.colors.grey4 }}
                          type={IconType.MATERIAL}
                          name="navigate-next"
                          size={24}
                          style={{
                            flex: 1,
                          }}
                        />
                      )}
                    </View>
                  </Pressable>
                </Swipeable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
      <BottomButtonAdd onPress={createNewInvoice} />
      <ActionBottomNew visible={isChoseMultiple}>
        <TouchableOpacity
          style={[
            styles.flexRow,
            {
              gap: 4,
              padding: 12,
              justifyContent: "center",
              backgroundColor:
                arrIdHoaDonChosed?.length > 0
                  ? theme.colors.error
                  : theme.colors.disabled,
            },
          ]}
          onPress={removeMultipleInvoices}
        >
          <Icon
            name="trash-outline"
            type={IconType.IONICON}
            color={theme.colors.white}
            size={20}
          />
          <Text
            style={{
              color: theme.colors.white,
              fontSize: 16,
            }}
          >
            Xóa
          </Text>
        </TouchableOpacity>
      </ActionBottomNew>
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
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    tabsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 8,
      // backgroundColor: theme.colors.grey5,
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
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.grey4,
      borderWidth: 1,
    },
    tabItemAdd: {
      backgroundColor: theme.colors.white,
    },
    contentInvoice: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
