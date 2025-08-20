import { IconType } from "@/enum/IconType";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, barDataItem, LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TypeTime } from "../../enum/TypeTime";
import { IParamSearchFromToDto } from "../../services/commonDto/IParamSearchFromToDto";
import DashboardService from "../../services/dashboard/DashboardService";
import { useAppContext } from "../../store/react_context/AppProvider";
import ChartsFunc, { ChartAxisConfig } from "../../utils/ChartsFunc";
const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const firstLoad2 = useRef(true);
  const { chiNhanhCurrent } = useAppContext();
  const idChiNhanhCurrent = chiNhanhCurrent?.id ?? "";
  const [doanhThu, setDoanhThu] = useState(0);
  const [thucThu, setThucThu] = useState(0);
  const [soCuocHen, setSoCuocHen] = useState(0);
  const [soKhachMoi, setSoKhachMoi] = useState(0);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
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

    const tong = xx.reduce((total, item) => total + item.value, 0);
    setTongDoanhThu(tong);

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
    { value: 15, dataPointText: "15" },
    { value: 54, dataPointText: "54" },
    { value: 42, dataPointText: "42" },
  ];

  const initialSpacing = 20;
  const barWidth = 12;
  const barChartWidth = screenWidth - 80;
  const numberOfBars = dataDoanhThu.length;

  const spacing =
    numberOfBars < 3 ? 50 : (barChartWidth - initialSpacing) / numberOfBars;

  return (
    <ScrollView style={[styles.container]}>
      <View style={{ gap: 24 }}>
        <View style={{ gap: 16 }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 4,
              backgroundColor: "#66646626",
              width: 175,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text>Hôm nay, 01/08/2025</Text>
            <Icon name="chevron-down" type={IconType.IONICON} size={12} />
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={[styles.card, { gap: 8 }]}>
              <Icon name="attach-money" type={IconType.MATERIAL} size={15} />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                2.000.000.000
              </Text>
              <Text style={{ fontSize: 10 }}>Thực thu</Text>
            </View>
            <View style={[styles.card, { gap: 8 }]}>
              <Icon
                name="bar-chart-outline"
                type={IconType.IONICON}
                size={15}
              />
              <Text>{CommonFunc.formatCurrency(doanhThu)}</Text>
              <Text style={{ fontSize: 10 }}>Doanh thu</Text>
            </View>
            <View style={[styles.card, { gap: 8 }]}>
              <Icon name="calendar-outline" type={IconType.IONICON} size={15} />
              <Text>{CommonFunc.formatCurrency(soCuocHen)}</Text>
              <Text style={{ fontSize: 10 }}>Lịch hẹn</Text>
            </View>
            <View style={[styles.card, { gap: 8 }]}>
              <Icon
                name="cake-variant-outline"
                type={IconType.MATERIAL_COMMUNITY}
                size={15}
              />
              <Text>{CommonFunc.formatCurrency(soKhachMoi)}</Text>
              <Text style={{ fontSize: 10 }}>Sinh nhật</Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <Text style={styles.title}>Doanh thu</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {tongDoanhThu > 0 ? (
              <Text style={{ fontSize: 12 }}>
                {CommonFunc.formatCurrency(tongDoanhThu)}
              </Text>
            ) : (
              <Text>{""}</Text>
            )}

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  width: 54,
                  backgroundColor:
                    doanhThu_ParamFilter?.timeType === TypeTime.WEEK
                      ? theme.colors.primary
                      : theme.colors.disabled,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                }}
                onPress={() => DoanhThu_changeTypeTime(TypeTime.WEEK)}
              >
                <Text
                  style={{
                    color:
                      doanhThu_ParamFilter?.timeType === TypeTime.WEEK
                        ? theme.colors.white
                        : theme.colors.black,
                    textAlign: "center",
                  }}
                >
                  Tuần
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 54,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  backgroundColor:
                    doanhThu_ParamFilter?.timeType === TypeTime.MONTH
                      ? theme.colors.primary
                      : theme.colors.disabled,
                  borderRightColor: "#ccc",
                  borderRightWidth: 1,
                }}
                onPress={() => DoanhThu_changeTypeTime(TypeTime.MONTH)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color:
                      doanhThu_ParamFilter?.timeType === TypeTime.MONTH
                        ? theme.colors.white
                        : theme.colors.black,
                  }}
                >
                  Tháng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 54,
                  padding: 6,
                  backgroundColor:
                    doanhThu_ParamFilter?.timeType === TypeTime.YEAR
                      ? theme.colors.primary
                      : theme.colors.disabled,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                }}
                onPress={() => DoanhThu_changeTypeTime(TypeTime.YEAR)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color:
                      doanhThu_ParamFilter?.timeType === TypeTime.YEAR
                        ? theme.colors.white
                        : theme.colors.black,
                  }}
                >
                  Năm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {(dataDoanhThu?.length ?? 0) === 0 ? (
            <View>
              <Text style={{ textAlign: "center", paddingVertical: 40 }}>
                Không có dữ liệu để hiển thị
              </Text>
            </View>
          ) : (
            <>
              <View style={{ width: barChartWidth }}>
                <BarChart
                  data={dataDoanhThu}
                  width={barChartWidth}
                  frontColor={theme.colors.primary}
                  maxValue={barChartAxistConfig?.maxValue}
                  noOfSections={barChartAxistConfig?.noOfSections}
                  stepValue={barChartAxistConfig?.stepValue}
                  formatYLabel={(val: string) =>
                    ChartsFunc.formatYLabel(parseFloat(val), true)
                  }
                  barWidth={barWidth}
                  spacing={spacing}
                  initialSpacing={initialSpacing}
                  yAxisTextStyle={{ fontSize: 11 }}
                  xAxisLabelTextStyle={{
                    color: "black",
                    fontSize: 10,
                    marginRight: 10, // đẩy chữ vào trong một chút
                    transform: [{ translateX: 10 }],
                  }}
                  // xAxisLabelTextStyle={{ color: "transparent" }}
                />
              </View>
            </>
          )}
        </View>
        <View style={{ gap: 16 }}>
          <Text style={styles.title}>Lịch hẹn</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Số lượng</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  width: 54,
                  backgroundColor:
                    lichHen_ParamFilter?.timeType === TypeTime.WEEK
                      ? theme.colors.primary
                      : theme.colors.disabled,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                }}
                onPress={() => DoanhThu_changeTypeTime(TypeTime.WEEK)}
              >
                <Text
                  style={{
                    color:
                      lichHen_ParamFilter?.timeType === TypeTime.WEEK
                        ? theme.colors.white
                        : theme.colors.black,
                    textAlign: "center",
                  }}
                >
                  Tuần
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 54,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  backgroundColor:
                    lichHen_ParamFilter?.timeType === TypeTime.MONTH
                      ? theme.colors.primary
                      : theme.colors.disabled,
                  borderRightColor: "#ccc",
                  borderRightWidth: 1,
                }}
                onPress={() => DoanhThu_changeTypeTime(TypeTime.MONTH)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color:
                      lichHen_ParamFilter?.timeType === TypeTime.MONTH
                        ? theme.colors.white
                        : theme.colors.black,
                  }}
                >
                  Tháng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 54,
                  padding: 6,
                  backgroundColor:
                    lichHen_ParamFilter?.timeType === TypeTime.YEAR
                      ? theme.colors.primary
                      : theme.colors.disabled,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                }}
                onPress={() => DoanhThu_changeTypeTime(TypeTime.YEAR)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color:
                      lichHen_ParamFilter?.timeType === TypeTime.YEAR
                        ? theme.colors.white
                        : theme.colors.black,
                  }}
                >
                  Năm
                </Text>
              </TouchableOpacity>
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
            yAxisTextStyle={{ fontSize: 11 }}
            xAxisLabelTextStyle={{ fontSize: 11 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    boxPadding: { paddingHorizontal: 16, paddingVertical: 8 },
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
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 16,
      height: 60,
      width: (screenWidth - 80) / 4,
      backgroundColor: "#E8E8E8",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.25,
      shadowRadius: 3, // tương đương với Blur
    },
    title: { fontSize: 16, fontWeight: 700 },
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
