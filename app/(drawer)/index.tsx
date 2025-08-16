import { Theme } from "@rneui/base";
import { Button, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { BarChart, barDataItem, LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TypeTime } from "../../enum/TypeTime";
import { IParamSearchFromToDto } from "../../services/commonDto/IParamSearchFromToDto";
import DashboardService from "../../services/dashboard/DashboardService";
import { useAppContext } from "../../store/react_context/AppProvider";
import ChartsFunc, { ChartAxisConfig } from "../../utils/ChartsFunc";

export default function Dashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const firstLoad2 = useRef(true);
  const { chiNhanhCurrent } = useAppContext();
  const idChiNhanhCurrent = chiNhanhCurrent?.id ?? "";
  const [doanhThu, setDoanhThu] = useState(0);
  const [thucThu, setThucThu] = useState(0);
  const [soCuocHen, setSoCuocHen] = useState(0);
  const [soKhachMoi, setSoKhachMoi] = useState(0);
  const [doanhThu_TypeTime, setDoanhThu_TypeTime] = useState(0);
  const [dataDoanhThu, setDataDoanhThu] = useState<barDataItem[]>([]);
  const [barChartAxistConfig, setBarChartAxistConfig] =
    useState<ChartAxisConfig>();

  const Card = ({ title, value }: { title: string; value: string }) => (
    <View style={styles.card}>
      <Text style={{ fontSize: 18 }}>{title}</Text>
      <Text style={styles.number}>{value}</Text>
    </View>
  );

  const [doanhThu_ParamFilter, setDoanhThu_ParamFilter] =
    useState<IParamSearchFromToDto>({
      timeType: TypeTime.WEEK,
      fromDate: dayjs().startOf("week").add(-1, "day").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD"),
      idChiNhanhs: [idChiNhanhCurrent],
    });
  const [lichHen_ParamFilter, setLichHen_ParamFilter] =
    useState<IParamSearchFromToDto>({
      timeType: TypeTime.WEEK,
      fromDate: dayjs().startOf("week").add(-1, "day").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD"),
      idChiNhanhs: [idChiNhanhCurrent],
    });

  const arrFilterButton = [
    { id: TypeTime.WEEK, label: "Tuần" },
    { id: TypeTime.MONTH, label: "Tháng" },
    { id: TypeTime.YEAR, label: "Năm" },
  ];

  const ThongKeSoLuong = useCallback(async () => {
    const input: IParamSearchFromToDto = {
      fromDate: dayjs().format("YYYY-MM-DD"),
      toDate: dayjs().format("YYYY-MM-DD"),
      idChiNhanhs: [idChiNhanhCurrent],
    };
    const xx = await DashboardService.ThongKeSoLuong(input);

    if (xx !== null) {
      setDoanhThu(xx.tongDoanhThu);
      setThucThu(xx.tongThucThu);
      setSoCuocHen(xx.tongLichHen);
      setSoKhachMoi(xx.tongKhachHangSinhNhat); //todo
    }
  }, [idChiNhanhCurrent]);

  useEffect(() => {
    ThongKeSoLuong();
  }, [ThongKeSoLuong]);

  const ThongKeLichHen = async () => {
    const xx = await DashboardService.ThongKeLichHen(doanhThu_ParamFilter);
  };

  const ThongKeDoanhThu = useCallback(async () => {
    const xx = await DashboardService.ThongKeDoanhThu(doanhThu_ParamFilter);

    let timeThis = "";
    switch (doanhThu_ParamFilter?.timeType) {
      case TypeTime.WEEK:
        {
          timeThis = dayjs().format("D");
          timeThis = "Ngày " + timeThis;
        }
        break;
      case TypeTime.MONTH:
        {
          timeThis = dayjs().format("M");
          timeThis = "Tháng " + timeThis;
        }
        break;
      case TypeTime.YEAR:
        {
          timeThis = dayjs().format("YYYY");
          timeThis = "Năm " + timeThis;
        }
        break;
    }
    if (xx !== undefined) {
      const values = xx?.map((item) => item.value);
      const config = ChartsFunc.getChartAxisConfig(values);
      setBarChartAxistConfig({ ...config });
    }

    const xx2 = xx?.map((x) => {
      if (x.label.includes(timeThis.toString())) {
        return {
          label: x.label,
          value: x.value,
          topLabelComponent: () => (
            <Text style={styles.barCharTtopLabel}>
              {ChartsFunc.formatYLabel(x.value)}
            </Text>
          ),
        } as barDataItem;
      } else {
        return {
          label: x.label,
          value: x.value,
        } as barDataItem;
      }
    });
    setDataDoanhThu([...xx2]);
  }, [doanhThu_ParamFilter]);

  useEffect(() => {
    ThongKeDoanhThu();
  }, [ThongKeDoanhThu]); // Chỉ trigger khi filter thực sự thay đổi

  useEffect(() => {
    if (firstLoad2.current) {
      firstLoad2.current = false;
      return;
    }
    setDoanhThu_ParamFilter((prev) => ({
      ...prev,
      idChiNhanhs: [idChiNhanhCurrent],
    }));
  }, [idChiNhanhCurrent]);

  const PageLoad = async () => {
    //
  };

  useEffect(() => {
    PageLoad();
  }, []);

  const DoanhThu_changeTypeTime = (newVal: number) => {
    switch (newVal) {
      case TypeTime.WEEK:
        {
          setDoanhThu_ParamFilter({
            ...doanhThu_ParamFilter,
            timeType: newVal,
            fromDate: dayjs().startOf("week").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD"),
          });
        }
        break;
      case TypeTime.MONTH:
        {
          setDoanhThu_ParamFilter({
            ...doanhThu_ParamFilter,
            timeType: newVal,
            fromDate: dayjs().startOf("year").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD"),
          });
        }
        break;
      case TypeTime.YEAR:
        {
          setDoanhThu_ParamFilter({
            ...doanhThu_ParamFilter,
            timeType: newVal,
            fromDate: dayjs()
              .startOf("year")
              .subtract(-6, "year")
              .format("YYYY-MM-DD"),
            toDate: dayjs()
              .endOf("year")
              .subtract(-6, "year")
              .add(1, "day")
              .format("YYYY-MM-DD"),
          });
        }
        break;
    }
  };

  const lineData = [
    { value: 0, dataPointText: "0" },
    { value: 20, dataPointText: "20" },
    { value: 18, dataPointText: "18" },
    { value: 40, dataPointText: "40" },
    { value: 36, dataPointText: "36" },
    { value: 60, dataPointText: "60" },
    { value: 54, dataPointText: "54" },
    { value: 85, dataPointText: "85" },
  ];

  return (
    <ScrollView style={[styles.container]}>
      <View style={styles.upContainer}>
        <View style={styles.summaryRow}>
          <Card
            title="Thực thu"
            value={ChartsFunc.formatYLabel(thucThu, true)}
          />
          <Card
            title="Doanh thu"
            value={ChartsFunc.formatYLabel(doanhThu, true)}
          />
        </View>
        <View style={[styles.summaryRow, { marginTop: 16 }]}>
          <Card title="Số cuộc hẹn" value={soCuocHen.toString()} />
          <Card title="Khách sinh nhật" value={soKhachMoi.toString()} />
        </View>
      </View>

      <ScrollView style={styles.downContainer}>
        <View style={[styles.flexRow, styles.filterRow]}>
          <Text style={{ fontSize: 18 }}>Doanh thu</Text>
          <View style={styles.buttonGroup}>
            {arrFilterButton?.map((x) => (
              <Button
                key={x.id}
                title={x.label}
                buttonStyle={{
                  backgroundColor:
                    x.id === doanhThu_ParamFilter?.timeType
                      ? theme.colors.primary
                      : theme.colors.disabled,
                }}
                onPress={() => DoanhThu_changeTypeTime(x.id)}
              />
            ))}
          </View>
        </View>

        {(dataDoanhThu?.length ?? 0) === 0 ? (
          <View>
            <Text style={{ textAlign: "center", paddingVertical: 40 }}>
              Không có dữ liệu để hiển thị
            </Text>
          </View>
        ) : (
          <BarChart
            data={dataDoanhThu}
            width={screenWidth - 80}
            frontColor={theme.colors.primary}
            maxValue={barChartAxistConfig?.maxValue}
            noOfSections={barChartAxistConfig?.noOfSections}
            stepValue={barChartAxistConfig?.stepValue}
            formatYLabel={(val: string) =>
              ChartsFunc.formatYLabel(parseFloat(val), true)
            }
            barWidth={40}
            spacing={
              (dataDoanhThu?.length ?? 0) < 4
                ? 30
                : (screenWidth - 80) / (dataDoanhThu?.length - 1)
            }
            initialSpacing={20}
            scrollToEnd
            // căn chỉnh chữ trục X cho đẹp
            xAxisLabelTextStyle={{
              color: "black",
              fontSize: 12,
              marginRight: 10, // đẩy chữ vào trong một chút
              transform: [{ translateX: 10 }],
            }}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <View style={[styles.flexRow, styles.filterRow]}>
            <Text style={{ fontSize: 18 }}>Lịch hẹn</Text>
            <View style={styles.buttonGroup}>
              {arrFilterButton?.map((x) => (
                <Button
                  key={x.id}
                  title={x.label}
                  buttonStyle={{
                    backgroundColor:
                      x.id === TypeTime.WEEK
                        ? theme.colors.primary
                        : theme.colors.disabled,
                  }}
                />
              ))}
            </View>
          </View>

          <LineChart
            data={lineData}
            initialSpacing={0}
            width={screenWidth - 80}
            textFontSize={13}
            textColor1={theme.colors.primary}
            thickness={2}
            color={theme.colors.primary}
            spacing={(screenWidth - 40) / (lineData.length - 1)}
            textShiftY={-8}
            textShiftX={-10}
            xAxisLabelTexts={["T2", "T3", "T4", "T5", "T6", "T7", "CN"]}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    barCharTtopLabel: {
      color: theme.colors.primary,
      fontSize: 14,
      marginBottom: 6,
    },
    card: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 5,
    },
    upContainer: {
      backgroundColor: theme.colors.primary,
      padding: 16,
    },
    downContainer: {
      backgroundColor: theme.colors.white,
      padding: 16,
      paddingBottom: 0,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
    },
    summaryBox: {
      borderRadius: 10,
      backgroundColor: "white",
      padding: 16,
      elevation: 2,
    },
    filterRow: {
      justifyContent: "space-between",
    },
    number: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 8,
    },
    buttonGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
