import { Theme } from "@rneui/base";
import { Button, useTheme } from "@rneui/themed";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { BackDropView } from "../../components/back_drop_view";
import { ModalContainer } from "../../components/modal_container";
import { PropModal } from "../../type/PropModal";
import ListProductSale from "../_list_product_sale";
import { TitleModal } from "../_title_modal";

export const ModalListProduct = ({
  isShow,
  onClose,
  onSave,
}: PropModal<string[]>) => {
  const { theme } = useTheme();
  const [isDoneAgreeChoseProduct, setIsDoneAgreeChoseProduct] =
    useState<boolean>(false);
  const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);

  const choseProduct = (
    arrIdQuyDoi: string[],
    isCheckMultipleProduct?: boolean
  ) => {
    setArrIdQuyDoiChosed([...arrIdQuyDoi]);
  };

  const agree = () => {
    setIsDoneAgreeChoseProduct(true);
    onSave(arrIdQuyDoiChosed);
  };

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <BackDropView>
        <ModalContainer style={{ position: "relative" }}>
          <TitleModal title="Thêm sản phẩm vào giỏ hàng" onClose={onClose} />
          <ListProductSale
            isLoadData={isShow}
            isDoneAgreeChoseProduct={isDoneAgreeChoseProduct}
            onClickChoseProduct={choseProduct}
          />
          <View style={{ position: "absolute", bottom: 16, right: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                size="lg"
                radius={"sm"}
                title={"Bỏ qua"}
                color={"error"}
                onPress={onClose}
              />
              <Button
                size="lg"
                radius={"sm"}
                title={"Đồng ý"}
                onPress={agree}
              />
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      width: "100%",
      height: "100%",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      marginTop: 12, // cách top 1 đoạn để vẫn tạo cảm giác như modal
      overflow: "hidden",
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    boxContainer: {
      justifyContent: "space-between",
      padding: 10,
    },
    textRightIcon: {
      paddingLeft: 8,
    },
  });
