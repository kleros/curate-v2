import React, { createContext, useContext, useState, ReactNode } from "react";
import { RegistryDetailsFragment } from "src/graphql/graphql";

interface RegistryDetailsContextType {
  registryDetails: RegistryDetailsFragment | null;
  setRegistryDetails: (details: RegistryDetailsFragment | null) => void;
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
  const [registryDetails, setRegistryDetails] = useState<RegistryDetailsFragment | null>(null);

  return (
    <RegistryDetailsContext.Provider value={{ registryDetails, setRegistryDetails }}>
      {children}
    </RegistryDetailsContext.Provider>
  );
};
