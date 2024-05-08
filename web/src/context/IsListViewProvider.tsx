import React, { createContext, useContext } from "react";
import { useLocalStorage, useToggle } from "react-use";

interface IIsListViewProvider {
  isListView: boolean;
  setIsListView: (arg0: boolean) => void;
}

const Context = createContext<IIsListViewProvider>({
  isListView: false,
  setIsListView: () => {
    //
  },
});

const IsListViewProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isListViewStorage, setIsListViewStorage] = useLocalStorage("isListView", false);
  const [isListView, setIsListViewState] = useToggle(isListViewStorage ?? false);
  const setIsListView = (toggle: boolean) => {
    setIsListViewState(toggle);
    setIsListViewStorage(toggle);
  };

  const value = {
    isListView,
    setIsListView,
  };
  return <Context.Provider {...{ value }}>{children}</Context.Provider>;
};

export const useIsListView = () => useContext(Context);

export default IsListViewProvider;
