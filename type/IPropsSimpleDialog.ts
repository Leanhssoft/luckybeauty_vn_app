export type IPropsSimpleDialog = {
  isShow: boolean;
  title?: string;
  mes?: string;
};
export type IPropsSimpleDialogWithAction = IPropsSimpleDialog & {
  onClose: () => void;
};
