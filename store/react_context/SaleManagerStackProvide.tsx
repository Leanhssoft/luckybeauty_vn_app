import { createContext, useContext, useMemo, useState } from "react";

type CurrentInvoiceType = {
  idHoaDon?: string;
  idLoaiChungTu?: number;
  maHoaDon?: number;
  countProduct?: number;
  tongPhaiTra?: number;
};

type SaleManagerStackContextType = {
  currentInvoice: CurrentInvoiceType | null;
  setCurrentInvoice: (curentInvoice: CurrentInvoiceType | null) => void;
  isHideTabs?: boolean;
  setIsHideTab?: (isHide: boolean) => void;
};

const SaleManagerStackContext = createContext<
  SaleManagerStackContextType | undefined
>(undefined);

export const SaleManagerStackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentInvoice, setCurrentInvoice] =
    useState<CurrentInvoiceType | null>(null);
  const [isHideTabs, setIsHideTab] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      currentInvoice,
      setCurrentInvoice,
      isHideTabs,
      setIsHideTab,
    }),
    [currentInvoice, isHideTabs]
  );

  return (
    <SaleManagerStackContext.Provider
      value={{
        currentInvoice,
        setCurrentInvoice,
        isHideTabs,
        setIsHideTab,
      }}
    >
      {children}
    </SaleManagerStackContext.Provider>
  );
};

export const useSaleManagerStackContext = () => {
  const context = useContext(SaleManagerStackContext);
  if (!context) {
    throw new Error("useTabTitle must be used within a TabTitleProvider");
  }
  return context;
};
