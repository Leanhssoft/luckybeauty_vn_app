import ApiConst from "@/const/ApiConst";
import AppConst from "@/const/AppConst";
import { IconType } from "@/enum/IconType";
import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import CustomerGroupService from "@/services/customer_group/CustomerGroupService";
import { ICustomerGroupDto } from "@/services/customer_group/ICustomerGroupDto";
import { PropModal } from "@/type/PropModal";
import { Button } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TitleModal } from "../_title_modal";
import { BackDropView } from "../back_drop_view";
import { ModalContainer } from "../modal_container";

const ModalListCustomerGroup = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<ICustomerGroupDto>) => {
  const { theme } = useTheme();
  const [mesErr, setMesErr] = useState("");

  const [customerGroupchosed, setCustomerGroupChosed] =
    useState<ICustomerGroupDto | null>(null);
  const [pageDataNhomKhachHang, setPageDatNhomKhachHang] = useState<
    IPageResultDto<ICustomerGroupDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const getAllNhomKhach = async () => {
    const input: IPagedRequestDto = {
      keyword: "",
      skipCount: 1,
      maxResultCount: 10,
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
    if (isShow) {
      getAllNhomKhach();
      setMesErr("");
      setCustomerGroupChosed({
        id: objUpdate?.id ?? ApiConst.GUID_EMPTY,
        tenNhomKhach: objUpdate?.tenNhomKhach ?? "",
      });
    }
  }, [isShow, objUpdate?.id]);

  const onClickChonNhom = (item: ICustomerGroupDto | null) => {
    if (item) {
      setCustomerGroupChosed({ ...item });
    } else {
      setCustomerGroupChosed(null);
    }
    setMesErr("");
  };

  const onChoseNhomKhach = async () => {
    if (customerGroupchosed == null) {
      setMesErr("Vui lòng chọn nhóm khách");
      return;
    }
    onSave(customerGroupchosed);
  };

  const renderItem = ({ item }: { item: ICustomerGroupDto }) => {
    const isSelected = customerGroupchosed?.id === item.id;
    return (
      <TouchableOpacity
        style={{
          padding: 12,
          borderBottomColor: theme.colors.grey5,
          borderBottomWidth: 1,
          marginTop: 8,
        }}
        onPress={() => onClickChonNhom(item)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{item.tenNhomKhach}</Text>
          {isSelected && (
            <Icon
              name="check"
              type={IconType.ANTDESIGN}
              color={theme.colors.primary}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isShow} transparent animationType="slide">
      <BackDropView
        style={{
          justifyContent: "flex-start",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <ModalContainer>
          <TitleModal
            title={`Nhóm khách (${pageDataNhomKhachHang?.totalCount ?? 0})`}
            onClose={onClose}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ padding: 16 }}>
            {mesErr && (
              <Text style={{ marginLeft: 8, color: theme.colors.error }}>
                {mesErr}
              </Text>
            )}
            <FlatList
              data={pageDataNhomKhachHang?.items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={() => (
                <TouchableOpacity
                  style={{
                    padding: 12,
                    borderBottomColor: theme.colors.grey5,
                    borderBottomWidth: 1,
                    marginTop: 8,
                  }}
                  onPress={() =>
                    onClickChonNhom({
                      id: ApiConst.GUID_EMPTY,
                      tenNhomKhach: "Nhóm mặc định",
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text>Nhóm mặc định</Text>
                    {customerGroupchosed?.id == ApiConst.GUID_EMPTY && (
                      <Icon
                        name="check"
                        type={IconType.ANTDESIGN}
                        color={theme.colors.primary}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={{ justifyContent: "flex-end", marginTop: 24 }}>
              <Button onPress={onChoseNhomKhach} radius={"md"}>
                Xong
              </Button>
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalListCustomerGroup;

const style = StyleSheet.create({
  modalContainer: {},
});
