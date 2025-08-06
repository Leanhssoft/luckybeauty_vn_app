import { Button, Dialog, Text } from "@rneui/themed";
import { IPropsSimpleDialogWithAction } from "../type/IPropsSimpleDialog";

export const SimpleDialog = ({
  isShow,
  title = "",
  mes = "",
  onClose,
}: IPropsSimpleDialogWithAction) => {
  return (
    <Dialog isVisible={isShow} onBackdropPress={onClose}>
      <Dialog.Title title={title} />
      <Text>{mes}</Text>
      <Dialog.Actions>
        <Button title={"Đóng"} color={"error"} onPress={onClose} />
      </Dialog.Actions>
    </Dialog>
  );
};
