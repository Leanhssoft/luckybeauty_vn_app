import { CheckBox, Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";
import { IProductBasic } from "../../services/product/dto";

type IPropItemProductSale = {
  item: IProductBasic;
  isShowCheck?: boolean;
  isChosed?: boolean;
  choseItem: (item: IProductBasic) => void;
};

export const ItemProductSale = ({
  item,
  isShowCheck,
  isChosed,
  choseItem,
}: IPropItemProductSale) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable
      style={[
        styles.flexRow,
        {
          marginTop: 4,
          padding: 10,
          backgroundColor: isChosed ? theme.colors.grey5 : undefined,
        },
      ]}
      onPress={() => choseItem(item)}
    >
      <View style={[styles.flexRow, styles.contentItem]}>
        <View style={{ gap: 4 }}>
          <Text>{item.tenHangHoa}</Text>
          <Text
            style={{
              color: theme.colors.success,
            }}
          >
            {item.maHangHoa}
          </Text>
        </View>
        <Text
          style={{
            fontWeight: 500,
          }}
        >
          {new Intl.NumberFormat("vi-VN").format(item.giaBan)}
        </Text>
      </View>
      {isShowCheck && (
        <CheckBox
          checked={isChosed ?? false}
          containerStyle={{ margin: 0, padding: 0 }}
          onPress={() => choseItem(item)}
        />
      )}
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    contentItem: {
      flex: 1,
      justifyContent: "space-between",
    },
  });
