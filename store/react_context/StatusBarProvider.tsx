import { createContext, useContext, useState } from "react";

type StatusBarStyle = "light" | "dark";

export type StatusBarConfig = {
  style: StatusBarStyle;
  backgroundColor: string;
};

type StatusBarContextType = {
  config: StatusBarConfig;
  setConfig: React.Dispatch<React.SetStateAction<StatusBarConfig>>;
};

const StatusBarDataContext = createContext<StatusBarContextType | null>(null);

export const StatusBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [config, setConfig] = useState<StatusBarConfig>({
    style: "dark",
    backgroundColor: "#ffff",
  });
  return (
    <StatusBarDataContext.Provider value={{ config, setConfig }}>
      {children}
    </StatusBarDataContext.Provider>
  );
};

export const useStatusBarContext = () => {
  const context = useContext(StatusBarDataContext);
  if (!context) {
    throw new Error("useStatusBar must be used within a StatusBarProvider");
  }
  return context;
};
