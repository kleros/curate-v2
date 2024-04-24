import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";

type Fields = {
  columns: {
    label: string;
    description: string;
    isIdentifier: boolean;
    type: string;
  }[];
  values?: Record<string, string>;
};
export interface ISubmitItemContext {
  fields: Fields;
  setFields: (field: Fields) => void;
  resetItemData: () => void;
  submissionDeposit?: string;
  setSubmissionDeposit: (deposit: string) => void;
  isPolicyRead: boolean;
  setIsPolicyRead: (isRead: boolean) => void;
}

const initialSubmitItemContext: ISubmitItemContext = {
  fields: { columns: [] },
  setFields: () => {},
  setSubmissionDeposit: () => {},
  resetItemData: () => {},
  isPolicyRead: false,
  setIsPolicyRead: () => {},
};

const SubmitItemContext = createContext<ISubmitItemContext>(initialSubmitItemContext);

export const useSubmitItemContext = () => useContext(SubmitItemContext);

export const SubmitItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields, setFields] = useLocalStorage<Fields>("fields", initialSubmitItemContext.fields);
  const [submissionDeposit, setSubmissionDeposit] = useLocalStorage<string | null>("submissionDeposit", null);
  const [isPolicyRead, setIsPolicyRead] = useLocalStorage<boolean>(
    "isPolicyRead",
    initialSubmitItemContext.isPolicyRead
  );

  const resetItemData = () => {
    setFields(initialSubmitItemContext.fields);
    setIsPolicyRead(initialSubmitItemContext.isPolicyRead);
    setSubmissionDeposit(null);
  };

  const contextValues = useMemo(
    () => ({
      fields,
      setFields,
      resetItemData,
      isPolicyRead,
      setIsPolicyRead,
      submissionDeposit,
      setSubmissionDeposit,
    }),
    [fields, isPolicyRead, submissionDeposit]
  );

  return <SubmitItemContext.Provider value={contextValues}>{children}</SubmitItemContext.Provider>;
};
