import AppConst from "@/const/AppConst";
import { IconType } from "@/enum/IconType";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PaginationProps = {
  currentPage: number;
  totalRow: number;
  totalPage: number;
  onChangePage: (newPage: number) => void;
};

const Pagination = ({
  currentPage,
  totalRow,
  totalPage,
  onChangePage,
}: PaginationProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const [fromLabel, setFromLabel] = useState<number>(0);
  const [toLabel, setToLabel] = useState<number>(0);
  const [arrPage, setArrpage] = useState<number[]>([]);

  const CaculatorArrPage = (totalPage: number) => {
    if (totalPage > 5) {
    } else {
      const arr: number[] = [];
      for (let i = 1; i < totalPage + 1; i++) {
        arr.push(i);
      }
      setArrpage([...arr]);
    }
  };

  const Caculator_FromTo = (totalRow: number, currentPage: number) => {
    let from = (currentPage - 1) * AppConst.PAGE_SIZE + 1;
    let to = currentPage * AppConst.PAGE_SIZE;

    if (to > totalRow) {
      to = totalRow;
    }
    setFromLabel(from);
    setToLabel(to);
  };

  useEffect(() => {
    CaculatorArrPage(totalPage);
  }, [totalPage]);

  useEffect(() => {
    Caculator_FromTo(totalRow, currentPage);
  }, [totalRow, currentPage]);

  const changePage = (newPage: number) => {
    onChangePage(newPage);
  };

  return (
    <View style={[styles.containerOut, { bottom: 0 }]}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ marginRight: 16 }}>
              {fromLabel} - {toLabel} / tổng số {totalRow}
            </Text>
          </View>
          <View style={{ gap: 8, flexDirection: "row", alignItems: "center" }}>
            {totalPage > 5 && (
              <Icon name="arrow-back-ios" type={IconType.MATERIAL} size={16} />
            )}
            {arrPage?.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.pageItem,
                  currentPage === item ? styles.btnActive : {},
                ]}
                onPress={() => changePage(item)}
              >
                <Text
                  style={[
                    styles.text,
                    currentPage === item ? styles.txtActive : {},
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
            {totalPage > 5 && (
              <Icon name="navigate-next" type={IconType.MATERIAL} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
export default Pagination;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    containerOut: {
      position: "absolute",
      width: "100%",
    },
    container: {
      justifyContent: "center",
      padding: 12,
      backgroundColor: theme.colors.white,
    },
    pageItem: { padding: 8, width: 40, height: 40 },
    btnActive: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
    },
    text: {
      textAlign: "center",
      fontSize: 16,
    },
    txtActive: {
      color: theme.colors.white,
    },
  });
