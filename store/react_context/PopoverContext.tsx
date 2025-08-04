import { createContext, useContext } from "react";

export const PopoverContext = createContext<{ onClosePopover: () => void }>({
  onClosePopover: () => {},
});

export const usePopoverContext = () => useContext(PopoverContext);
