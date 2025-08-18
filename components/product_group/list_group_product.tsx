import { IconType } from "@/enum/IconType";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { IProductGroupDto } from "@/services/product_group/dto";
import ProductGroupSevice from "@/services/product_group/ProductGroupSevice";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { Button } from "@rneui/base";
import { Icon, SearchBar, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TitleModal } from "../_title_modal";
import { BackDropView } from "../back_drop_view";
import { ModalContainer } from "../modal_container";

const ModalListProductGroup = ({
  isShow,
  onClose,
  onSave,
}: PropModal<IProductGroupDto>) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [mesErr, setMesErr] = useState("");
  const [textSearch, setTextSearch] = useState("");

  const [productGroupchosed, setProductGroupChosed] =
    useState<IProductGroupDto | null>(null);
  const [pageDataProductGroup, setPageDataProductGroup] = useState<
    IPageResultDto<IProductGroupDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const listSearch = pageDataProductGroup?.items?.filter((x) => {
    const txt = CommonFunc.convertString_toEnglish(textSearch);
    return CommonFunc.convertString_toEnglish(x.tenNhomHang).indexOf(txt) > -1;
  });

  const getAllProductGroup = async () => {
    const data = await ProductGroupSevice.GetAllNhomHangHoa();
    setPageDataProductGroup({
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: 1, // not important
    });
  };

  useEffect(() => {
    if (isShow) {
      getAllProductGroup();
      setMesErr("");
      setProductGroupChosed(null);
    }
  }, [isShow]);

  const onClickChonNhom = (item: IProductGroupDto) => {
    setProductGroupChosed({ ...item });
    setMesErr("");
  };

  const onChoseProductGroup = async () => {
    if (productGroupchosed == null) {
      setMesErr("Vui lòng chọn nhóm sản phẩm");
      return;
    }
    onSave(productGroupchosed);
  };

  const renderItem = ({ item }: { item: IProductGroupDto }) => {
    const isSelected = productGroupchosed?.id === item.id;
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
          <Text>{item.tenNhomHang}</Text>
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
      <BackDropView>
        <ModalContainer style={{ marginBottom: insets.bottom }}>
          <TitleModal
            title={`Nhóm sản phẩm (${pageDataProductGroup?.totalCount ?? 0})`}
            onClose={onClose}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ padding: 16 }}>
            {mesErr && (
              <Text style={{ marginLeft: 8, color: theme.colors.error }}>
                {mesErr}
              </Text>
            )}
            <SearchBar
              placeholder="Tìm kiếm"
              containerStyle={{
                backgroundColor: theme.colors.white,
              }}
              inputContainerStyle={{
                backgroundColor: theme.colors.white,
              }}
              value={textSearch}
              onChangeText={(txt) => setTextSearch(txt)}
            />
            <FlatList
              data={listSearch}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 500 }}
            />

            <View style={{ justifyContent: "flex-end", marginTop: 24 }}>
              <Button onPress={onChoseProductGroup}>Xong</Button>
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalListProductGroup;

const style = StyleSheet.create({
  modalContainer: {},
});
