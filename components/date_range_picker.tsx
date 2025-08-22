import { IconType } from "@/enum/IconType";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button, Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type DateRangeProps = {
  from: string;
  to: string;
  onChangeDate: (from: string, to: string) => void;
  onClose: () => void;
};

export default function DateRangePicker({
  from,
  to,
  onChangeDate,
  onClose,
}: DateRangeProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const screenWidth = Dimensions.get("window").width;

  const [isShowDateFrom, setIsShowDateFrom] = useState(false);
  const [isShowDateTo, setIsShowDateTo] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date(from));
  const [dateTo, setDateTo] = useState(new Date(to));

  useEffect(() => {
    setDateFrom(new Date(from));
  }, [from]);
  useEffect(() => {
    setDateTo(new Date(to));
  }, [to]);

  const changeDateFrom = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setDateFrom(date);
    }
    setIsShowDateFrom(false);
  };
  const changeDateTo = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setDateTo(date);
    }
    setIsShowDateTo(false);
  };

  const ApplyDateRange = () => {
    onChangeDate(
      dayjs(dateFrom).format("YYYY-MM-DD"),
      dayjs(dateTo).format("YYYY-MM-DD")
    );
  };
  return (
    <View style={{ padding: 8, position: "relative" }}>
      <Text>Tùy chỉnh thời gian</Text>
      <Icon
        name="close"
        type={IconType.IONICON}
        containerStyle={{ position: "absolute", top: 0, right: 0 }}
        onPress={onClose}
      />
      {isShowDateFrom && Platform.OS === "ios" && (
        <DateTimePicker
          value={dateFrom}
          mode="date"
          display="inline"
          timeZoneName="Asia/Ho_Chi_Minh"
          locale="vi-VN"
          onChange={changeDateFrom}
          style={{
            backgroundColor: theme.colors.background,
            width: screenWidth,
            position: "absolute",
            top: 80,
            left: 10,
            zIndex: 999999,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
          }}
          themeVariant="light"
        />
      )}
      {isShowDateTo && Platform.OS === "ios" && (
        <DateTimePicker
          value={dateTo}
          mode="date"
          display="inline"
          timeZoneName="Asia/Ho_Chi_Minh"
          locale="vi-VN"
          onChange={changeDateTo}
          style={{
            backgroundColor: theme.colors.background,
            width: screenWidth,
            position: "absolute",
            top: 80,
            left: 10,
            zIndex: 999999,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
          }}
          themeVariant="light"
        />
      )}

      <View style={[styles.flexRow, { marginTop: 16, gap: 16 }]}>
        <TouchableOpacity
          style={[
            styles.flexRow,
            styles.boxDate,
            {
              justifyContent: "space-between",
              flex: 1,
              borderColor: isShowDateFrom
                ? theme.colors.primary
                : theme.colors.grey5,
            },
          ]}
          onPress={() => {
            setIsShowDateFrom(true);
            setIsShowDateTo(false);
          }}
        >
          <View style={[styles.flexRow, { gap: 8 }]}>
            <Icon name="calendar-outline" type={IconType.IONICON} size={18} />
            <Text style={{ fontSize: 12 }}>
              {dayjs(dateFrom).format("DD/MM/YYYY")}
            </Text>
          </View>
          {isShowDateFrom ? (
            <Icon name="chevron-up" type={IconType.IONICON} size={18} />
          ) : (
            <Icon name="chevron-down" type={IconType.IONICON} size={18} />
          )}
        </TouchableOpacity>
        <Text style={{ fontSize: 12 }}>đến</Text>
        <TouchableOpacity
          style={[
            styles.flexRow,
            styles.boxDate,
            {
              justifyContent: "space-between",
              flex: 1,
              borderColor: isShowDateTo
                ? theme.colors.primary
                : theme.colors.grey5,
            },
          ]}
          onPress={() => {
            setIsShowDateTo(true);
            setIsShowDateFrom(false);
          }}
        >
          <View style={[styles.flexRow, { gap: 8 }]}>
            <Icon name="calendar-outline" type={IconType.IONICON} size={18} />
            <Text style={{ fontSize: 12 }}>
              {dayjs(dateTo).format("DD/MM/YYYY")}
            </Text>
          </View>
          {isShowDateTo ? (
            <Icon name="chevron-up" type={IconType.IONICON} size={18} />
          ) : (
            <Icon name="chevron-down" type={IconType.IONICON} size={18} />
          )}
        </TouchableOpacity>
      </View>
      <Button
        size="md"
        containerStyle={{ marginTop: 24 }}
        buttonStyle={{ borderRadius: 16 }}
        titleStyle={{ fontSize: 14 }}
        onPress={ApplyDateRange}
      >
        Áp dụng
      </Button>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    boxDate: {
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
    },
  });
