import React, { createContext, useContext, useState } from "react";

type DrawerContextType = {
  isHideHeader: boolean;
  setIsHideHeader: (isHide: boolean) => void;
};
const DrawerContext = createContext<DrawerContextType | null>(null);

export const DrawerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isHide, setIsHide] = useState(false);
  return (
    <DrawerContext.Provider
      value={{ isHideHeader: isHide, setIsHideHeader: setIsHide }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
};
