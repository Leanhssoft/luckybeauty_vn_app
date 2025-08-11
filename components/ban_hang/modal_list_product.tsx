import { Theme } from "@rneui/base";
import { Button, useTheme } from "@rneui/themed";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const [isDoneAgreeChoseProduct, setIsDoneAgreeChoseProduct] =
    useState<number>(0);
  const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);

  const choseProduct = (
    arrIdQuyDoi: string[],
    isCheckMultipleProduct?: boolean
  ) => {
    setArrIdQuyDoiChosed([...arrIdQuyDoi]);
  };

  const agree = () => {
    setIsDoneAgreeChoseProduct(() => isDoneAgreeChoseProduct + 1);
    onSave(arrIdQuyDoiChosed);
  };

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <BackDropView>
        <ModalContainer style={styles.modalContainer}>
          <TitleModal title="Thêm sản phẩm vào giỏ hàng" onClose={onClose} />
          <ListProductSale
            isLoadData={isShow}
            isDoneAgreeChoseProduct={isDoneAgreeChoseProduct}
            onClickChoseProduct={choseProduct}
          />
          <View style={[styles.boxButton]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
                paddingVertical: 16,
              }}
            >
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
    modalContainer: {
      height: "100%",
      flex: 1,
      position: "relative",
    },

    boxButton: {
      right: 16,
      position: "absolute",
      width: "100%",
      backgroundColor: theme.colors.white,
      bottom: 0,
    },
  });
