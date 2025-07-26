export type PropModal<T> = {
  isShow: boolean;
  objUpdate?: T;
  onClose: () => void;
  onSave: (objAfterSave: T, actionId?: number) => void;
};
