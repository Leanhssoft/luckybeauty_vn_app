import CommonFunc from './CommonFunc';

export type ChartAxisConfig = {
  maxValue: number;
  stepValue: number;
  noOfSections: number;
};
export class ChartsFunc {
  getChartAxisConfig = (values: number[], targetSections = 6): ChartAxisConfig => {
    if (values.length === 0) return { maxValue: 0, stepValue: 1, noOfSections: 1 };

    const rawMax = Math.max(...values);
    if (rawMax === 0) return { maxValue: 1, stepValue: 1, noOfSections: 1 };

    // Làm tròn stepValue: 3456 => 1000, 178 => 100, 58 => 10, v.v.
    const roughStep = rawMax / targetSections;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep))); // ví dụ: 1000
    const stepValue = Math.ceil(roughStep / magnitude) * magnitude;

    const noOfSections = Math.ceil(rawMax / stepValue);
    const maxValue = stepValue * noOfSections + stepValue / 2;

    return { maxValue, stepValue, noOfSections };
  };
  formatYLabel = (valNew: number, showDVT?: boolean): string => {
    if (valNew >= 1_000_000_000) {
      const ty = valNew / 1_000_000_000;
      return ty.toFixed(3).replace(/\.?0+$/, '') + (showDVT ? 'tỷ' : '');
    }

    if (valNew >= 1_000_000) {
      const tr = valNew / 1_000_000;
      return tr.toFixed(2).replace(/\.?0+$/, '') + (showDVT ? 'tr' : '');
    }
    if (valNew >= 1_000) {
      const nghin = valNew / 1_000;
      return nghin.toFixed(0) + (showDVT ? 'k' : '');
    }
    return CommonFunc.formatCurrency(valNew);
  };
}
export default new ChartsFunc();
