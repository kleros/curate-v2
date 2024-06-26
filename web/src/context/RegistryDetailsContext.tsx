import React, { createContext, useContext, useState, ReactNode } from "react";
import { ItemDetailsQuery } from "src/graphql/graphql";
import { RegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";

export type RegistryDetails = RegistryDetailsQuery["registry"] & ItemDetailsQuery["item"];
interface RegistryDetailsContextType {
  registryDetails: RegistryDetails | null;
  setRegistryDetails: (details: RegistryDetails | null) => void;
}

const RegistryDetailsContext = createContext<RegistryDetailsContextType>({
  registryDetails: null,
  setRegistryDetails: () => {},
});

export const useRegistryDetailsContext = () => {
  const context = useContext(RegistryDetailsContext);
  if (!context) {
    throw new Error("useRegistryDetailsContext must be used within a RegistryDetailsProvider");
  }

  const { registryDetails, setRegistryDetails } = context;
  return { ...registryDetails, setRegistryDetails };
};

export const RegistryDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registryDetails, setRegistryDetails] = useState<RegistryDetails | null>(null);

  return (
    <RegistryDetailsContext.Provider value={{ registryDetails, setRegistryDetails }}>
      {children}
    </RegistryDetailsContext.Provider>
  );
};
