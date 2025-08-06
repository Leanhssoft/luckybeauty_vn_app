import Pagination from "@/components/_pagination";
import AppConst from "@/const/AppConst";
import { IconType } from "@/enum/IconType";
import { LoaiDoiTuong } from "@/enum/LoaiDoiTuong";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import KhachHangService from "@/services/customer/KhachHangService";
import { IParamSearchCustomerDto } from "@/services/customer/ParamSearchCustomerDto";
import { useAppContext } from "@/store/react_context/AppProvider";
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
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomerPage = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { userLogin, chiNhanhCurrent } = useAppContext();
  const [textSearch, setTextSearch] = useState("");
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

  const getListCustomer = async () => {
    const data = await KhachHangService.getAll(paramSearchCustomer);
    setPageDataCustomer({
      ...pageDataCustomer,
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: Math.ceil(
        (data?.totalCount ?? 0) /
          (paramSearchCustomer?.pageSize ?? AppConst.PAGE_SIZE)
      ),
    });
  };

  const PageLoad = async () => {
    await getListCustomer();
  };

  useEffect(() => {
    PageLoad();
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: IKhachHangItemDto;
    index: number;
  }) => {
    // const backgroundColor = item.id === selectedId ? '#0a080aff' : '#f9c2ff';
    // const color = item.id === selectedId ? 'white' : 'black';

    return (
      <ListItem.Swipeable
        bottomDivider={false}
        containerStyle={{ paddingVertical: 8 }}
        rightContent={
          <Button
            title="Delete"
            // onPress={() => reset()}
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        }
      >
        <ListItem.Content style={styles.customerItem}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Avatar
              rounded
              size={"medium"}
              title={CommonFunc.getFirstLetter(item?.tenKhachHang)}
              containerStyle={{
                backgroundColor:
                  index % 4 === 1
                    ? "#BADEFB"
                    : index % 4 === 2
                    ? "#FFDDB7"
                    : index % 4 === 3
                    ? "#FFCDD3"
                    : "#C3E7E2",
              }}
              titleStyle={{
                fontSize: 18,
                color:
                  index % 4 === 1
                    ? "#448aff"
                    : index % 4 === 2
                    ? "#E97C24"
                    : index % 4 === 3
                    ? "#d36772"
                    : "#30958A",
              }}
            />
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: 600 }}>
                {item?.tenKhachHang}
              </Text>
              <Text style={{ color: theme.colors.grey5 }}>
                {item?.soDienThoai}
              </Text>
            </View>
          </View>
          <View style={styles.boxNumber}>
            <View style={{ gap: 8 }}>
              <Text>{item?.tenNhomKhach ?? " Nhóm mặc định"}</Text>
              <Text>
                Số dư thẻ:
                <Text style={{ fontSize: 16, fontWeight: 600 }}>
                  {CommonFunc.formatCurrency(item?.soDuTheGiaTri ?? 0)}
                </Text>
              </Text>
            </View>
            {(item?.conNo ?? 0) > 0 && (
              <View style={{ gap: 8 }}>
                <Text> Còn nợ</Text>

                <Text style={{ color: "red" }}>
                  {CommonFunc.formatCurrency(item?.conNo ?? 0)}
                </Text>
              </View>
            )}
          </View>
        </ListItem.Content>
      </ListItem.Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Tìm kiếm khách hàng"
        containerStyle={{
          paddingLeft: 16,
          paddingRight: 16,
          borderTopWidth: 0,
          paddingBottom: 0,
          backgroundColor: theme.colors.white,
        }}
        inputContainerStyle={{
          backgroundColor: theme.colors.white,
        }}
        inputStyle={{ fontSize: 14 }}
      />
      <FlatList
        data={pageDataCustomer?.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ paddingBottom: insets.bottom + 40 }}
      />
      <Pagination currentPage={paramSearchCustomer?.currentPage ?? 1} />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
        }}
        // onPress={createNewInvoice}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            // borderColor: theme.colors.white,
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
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: theme.colors.background,
      boxShadow: `-4px 4px 2px ${theme.colors.grey5}`,
    },
    boxNumber: {
      justifyContent: "space-between",
      flexDirection: "row",
      marginTop: 16,
      width: "100%",
    },
  });
