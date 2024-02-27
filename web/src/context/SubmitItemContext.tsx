import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";

export interface ISubmitItemContext {
  fieldOne: string;
  setFieldOne: (title: string) => void;
  resetItemData: () => void;
  isPolicyRead: boolean;
  setIsPolicyRead: (isRead: boolean) => void;
}

const initialSubmitItemContext: ISubmitItemContext = {
  fieldOne: "",
  setFieldOne: () => {},
  resetItemData: () => {},
  isPolicyRead: false,
  setIsPolicyRead: () => {},
};

const SubmitItemContext = createContext<ISubmitItemContext>(initialSubmitItemContext);

export const useSubmitItemContext = () => useContext(SubmitItemContext);

export const SubmitItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fieldOne, setFieldOne] = useLocalStorage<string>("fieldOne", initialSubmitItemContext.fieldOne);
  const [isPolicyRead, setIsPolicyRead] = useLocalStorage<boolean>(
    "isPolicyRead",
    initialSubmitItemContext.isPolicyRead
  );

  const resetItemData = () => {
    setFieldOne(initialSubmitItemContext.fieldOne);
    setIsPolicyRead(initialSubmitItemContext.isPolicyRead);
  };

  const contextValues = useMemo(
    () => ({
      fieldOne,
      setFieldOne,
      resetItemData,
      isPolicyRead,
      setIsPolicyRead,
    }),
    [fieldOne, isPolicyRead]
  );

  return <SubmitItemContext.Provider value={contextValues}>{children}</SubmitItemContext.Provider>;
};
