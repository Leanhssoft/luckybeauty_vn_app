import Pagination from "@/components/_pagination";
import { ConfirmOKCancel } from "@/components/confirm_ok_cancel";
import ModalAddCustomer from "@/components/customer/modal_add_customer";
import AppConst from "@/const/AppConst";
import { ActionType } from "@/enum/ActionType";
import { IconType } from "@/enum/IconType";
import { LoaiDoiTuong } from "@/enum/LoaiDoiTuong";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { ICreateOrEditKhachHangDto } from "@/services/customer/ICreateOrEditKhachHangDto";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import KhachHangService from "@/services/customer/KhachHangService";
import { IParamSearchCustomerDto } from "@/services/customer/ParamSearchCustomerDto";
import { useAppContext } from "@/store/react_context/AppProvider";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import {
  Avatar,
  Button,
  Icon,
  ListItem,
  SearchBar,
  useTheme,
} from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomerPage = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { userLogin, chiNhanhCurrent } = useAppContext();
  const [textSearch, setTextSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false);
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();
  const [customerChosed, setCustomerChosed] = useState<IKhachHangItemDto>();

  const [pageDataCustomer, setPageDataCustomer] = useState<
    IPageResultDto<IKhachHangItemDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const [paramSearchCustomer, setParamSearchCustomer] =
    useState<IParamSearchCustomerDto>({
      idChiNhanhs: [chiNhanhCurrent?.id ?? ""],
      idNhomKhachs: [],
      loaiDoiTuong: LoaiDoiTuong.KHACH_HANG,
      currentPage: 1,
      pageSize: AppConst.PAGE_SIZE,
    });

  const getListCustomer = async (param: IParamSearchCustomerDto) => {
    setIsLoading(true);
    const data = await KhachHangService.getAll(param);

    setPageDataCustomer({
      ...pageDataCustomer,
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: Math.ceil(
        (data?.totalCount ?? 0) /
          (paramSearchCustomer?.pageSize ?? AppConst.PAGE_SIZE)
      ),
    });
    setIsLoading(false);
  };

  const PageLoad = async () => {
    //await getListCustomer();
  };

  useEffect(() => {
    PageLoad();
  }, []);

  const onChangePage = async (newPage: number) => {
    setParamSearchCustomer((prev) => {
      return {
        ...prev,
        currentPage: newPage,
      };
    });
    const param = {
      ...paramSearchCustomer,
    };
    param.currentPage = newPage;
    await getListCustomer(param);
  };

  useEffect(() => {
    const getData = setTimeout(async () => {
      const param = {
        ...paramSearchCustomer,
      };
      param.textSearch = textSearch;
      param.currentPage = 1;
      setParamSearchCustomer((prev) => {
        return {
          ...prev,
          currentPage: 1,
        };
      });
      await getListCustomer(param);
    }, 2000);
    return () => clearTimeout(getData);
  }, [textSearch]);

  const onClickDelete = (item: IKhachHangItemDto) => {
    setCustomerChosed({ ...item });
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: `Bạn có chắc chắn muốn xóa khách hàng ${item?.tenKhachHang} không`,
    });
  };
  const deleteCustomer = async () => {
    setObjSimpleDialog({ ...objSimpleDialog, isShow: false });
    await KhachHangService.delete(customerChosed?.id ?? "");
    setPageDataCustomer({
      ...pageDataCustomer,
      items: pageDataCustomer?.items?.filter(
        (x) => x.id !== customerChosed?.id
      ),
      totalCount: (pageDataCustomer?.totalCount ?? 0) - 1,
    });
  };

  const saveOKCustomer = (
    cusItem: ICreateOrEditKhachHangDto,
    actionid?: number
  ) => {
    setIsShowModalAddCustomer(false);

    switch (actionid) {
      case ActionType.INSERT:
        {
          setPageDataCustomer({
            ...pageDataCustomer,
            items: [cusItem, ...pageDataCustomer?.items],
            totalCount: (pageDataCustomer?.totalCount ?? 0) + 1,
          });
        }
        break;
      case ActionType.UPDATE:
        {
          setPageDataCustomer({
            ...pageDataCustomer,
            items: pageDataCustomer?.items?.map((x) => {
              if (x.id === cusItem?.id) {
                return {
                  ...x,
                  tenKhachHang: cusItem?.tenKhachHang,
                  tenNhomKhach: cusItem?.tenNhomKhach,
                  soDienThoai: cusItem?.soDienThoai,
                  idNhomKhach: cusItem?.idNhomKhach,
                  diaChi: cusItem?.diaChi,
                  ngaySinh: cusItem?.ngaySinh,
                  gioiTinhNam: cusItem?.gioiTinhNam,
                };
              } else {
                return { ...x };
              }
            }),
          });
        }
        break;
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: IKhachHangItemDto;
    index: number;
  }) => {
    return (
      <ListItem.Swipeable
        bottomDivider={false}
        containerStyle={{ paddingHorizontal: 4, paddingVertical: 8 }}
        rightContent={(reset) => (
          <Button
            title="Xóa"
            onPress={() => {
              onClickDelete(item);
              reset();
            }}
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        )}
      >
        <RectButton onPress={() => router.push(`/details/${item?.id}`)}>
          <ListItem.Content style={styles.customerItem}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Avatar
                rounded
                size={"medium"}
                title={CommonFunc.getFirstLetter(item?.tenKhachHang)}
                containerStyle={{
                  backgroundColor:
                    index % 4 === 1
                      ? theme.colors.softBlue_background
                      : index % 4 === 2
                      ? theme.colors.softOrange_background
                      : index % 4 === 3
                      ? theme.colors.softPink_background
                      : theme.colors.softTeal_background,
                }}
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
              <View style={{ gap: 4, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: 600 }}>
                  {item?.tenKhachHang}
                </Text>
                {item?.soDienThoai && (
                  <Text style={{ color: theme.colors.grey4 }}>
                    {item?.soDienThoai}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.boxNumber}>
              <View style={{ gap: 8 }}>
                <Text>{item?.tenNhomKhach ?? "Nhóm mặc định"}</Text>
                <Text>
                  Số dư thẻ:
                  <Text style={{ fontWeight: 600 }}>
                    {` ${CommonFunc.formatCurrency(item?.soDuTheGiaTri ?? 0)}`}
                  </Text>
                </Text>
              </View>
              <View style={{ gap: 8, alignItems: "center" }}>
                <Text> Còn nợ</Text>
                <Text
                  style={{
                    color:
                      (item?.conNo ?? 0) > 0
                        ? theme.colors.error
                        : theme.colors.black,
                  }}
                >
                  {CommonFunc.formatCurrency(item?.conNo ?? 0)}
                </Text>
              </View>
            </View>
          </ListItem.Content>
        </RectButton>
      </ListItem.Swipeable>
    );
  };

  return (
    <View style={[styles.container, { position: "relative" }]}>
      <ConfirmOKCancel
        isShow={objSimpleDialog?.isShow ?? false}
        mes={objSimpleDialog?.mes}
        onAgree={deleteCustomer}
        onClose={() =>
          setObjSimpleDialog({ ...objSimpleDialog, isShow: false })
        }
      />
      <ModalAddCustomer
        isShow={isShowModalAddCustomer}
        onClose={() => setIsShowModalAddCustomer(false)}
        onSave={saveOKCustomer}
      />
      <SearchBar
        placeholder="Tìm kiếm khách hàng"
        containerStyle={{
          borderTopWidth: 0,
          paddingVertical: 0,
          paddingHorizontal: 16,
          backgroundColor: theme.colors.white,
        }}
        inputContainerStyle={{
          backgroundColor: theme.colors.white,
        }}
        inputStyle={{ fontSize: 14 }}
        value={textSearch}
        onChangeText={(txt) => setTextSearch(txt)}
      />
      {isLoading && (
        <ActivityIndicator
          size={"large"}
          style={{
            position: "absolute",
            top: 100,
            width: "100%",
            zIndex: 99999,
          }}
        />
      )}
      <FlatList
        data={pageDataCustomer?.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ paddingBottom: insets.bottom + 40 }}
      />
      <Pagination
        currentPage={paramSearchCustomer?.currentPage ?? 1}
        totalRow={pageDataCustomer?.totalCount ?? 0}
        totalPage={pageDataCustomer?.totalPage ?? 0}
        onChangePage={onChangePage}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 70,
          right: 8,
        }}
        onPress={() => setIsShowModalAddCustomer(true)}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
          }}
        >
          <Icon
            type={IconType.MATERIAL}
            name="add"
            color={theme.colors.white}
            size={50}
          ></Icon>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default CustomerPage;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 8,
    },
    customerItem: {
      padding: 20,
      borderRadius: 8,
      backgroundColor: theme.colors.background,

      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,

      // Đổ bóng Android
      elevation: 3,
    },
    boxNumber: {
      justifyContent: "space-between",
      flexDirection: "row",
      marginTop: 16,
      width: "100%",
    },
  });
