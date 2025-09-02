import ApiConst from "@/const/ApiConst";
import AppConst from "@/const/AppConst";
import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import CustomerGroupService from "@/services/customer_group/CustomerGroupService";
import { ICustomerGroupDto } from "@/services/customer_group/ICustomerGroupDto";
import { useNhomKhachHangStore } from "@/store/zustand/nhom_khach_hang";
import { Button, Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type ListCustomerGroupProps = {
  selectedId: string;
  choseItem: (item: ICustomerGroupDto) => void;
};

export function ListCustomerGroup({
  selectedId,
  choseItem,
}: ListCustomerGroupProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const nhomKhachStore = useNhomKhachHangStore((x) => x.nhomKhach);

  const [pageDataNhomKhachHang, setPageDatNhomKhachHang] = useState<
    IPageResultDto<ICustomerGroupDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const getAllNhomKhach = async () => {
    const input: IPagedRequestDto = {
      keyword: "",
      skipCount: 1,
      maxResultCount: 100,
    };
    const data = await CustomerGroupService.getAllNhomKhach(input);
    setPageDatNhomKhachHang({
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: Math.ceil(
        (data?.totalCount ?? 0) / (input?.maxResultCount ?? AppConst.PAGE_SIZE)
      ),
    });
  };

  useEffect(() => {
    getAllNhomKhach();
  }, []);

  useEffect(() => {
    if (nhomKhachStore) {
      setPageDatNhomKhachHang((prev) => {
        return {
          ...prev,
          items: [nhomKhachStore, ...prev.items],
          totalCount: prev?.totalCount + 1,
        };
      });
    }
  }, [nhomKhachStore]);

  return (
    <ScrollView horizontal style={{ marginTop: 16 }}>
      <Button
        title={"Tất cả"}
        titleStyle={{ fontSize: 14 }}
        containerStyle={[
          {
            padding: 0,
          },
        ]}
        buttonStyle={{
          backgroundColor:
            selectedId === "" ? theme.colors.primary : theme.colors.disabled,
        }}
        onPress={() =>
          choseItem({
            id: "",
            tenNhomKhach: "Tất cả",
          })
        }
      ></Button>
      <Button
        title={"Nhóm mặc định"}
        titleStyle={{ fontSize: 14 }}
        containerStyle={[styles.item]}
        buttonStyle={{
          backgroundColor:
            selectedId === ApiConst.GUID_EMPTY
              ? theme.colors.primary
              : theme.colors.disabled,
        }}
        onPress={() =>
          choseItem({
            id: ApiConst.GUID_EMPTY,
            tenNhomKhach: "Nhóm mặc định",
          })
        }
      ></Button>
      {pageDataNhomKhachHang?.items?.map((item) => (
        <Button
          key={item.id}
          title={item.tenNhomKhach}
          titleStyle={{ fontSize: 14 }}
          containerStyle={[styles.item]}
          buttonStyle={{
            backgroundColor:
              selectedId === item.id
                ? theme.colors.primary
                : theme.colors.disabled,
          }}
          onPress={() => choseItem(item)}
        ></Button>
      ))}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    item: {
      padding: 0,
      marginLeft: 8,
      minWidth: 60,
    },
  });
