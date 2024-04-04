import React, { createContext, useState, useContext, useMemo } from "react";

import { useLocalStorage } from "hooks/useLocalStorage";
import { EVIDENCE_MODULE, KLEROS_ARBITRATOR } from "consts/arbitration";

export interface IList {
  governor: string;
  arbitrator: string;
  evidenceModule: string;
  connectedList: string;
  arbitratorExtraData?: string;
  templateRegistryParams: {
    templateRegistry: `0x${string}`;
    registrationTemplateParameters: [string, string];
    removalTemplateParameters: [string, string];
  };
  baseDeposits: [bigint, bigint, bigint, bigint];
  relayerContract: string;
  listMetadata?: string;
  challengePeriodDuration: number;
}

export const FieldTypes = ["Text", "Address", "Image", "Link", "Number", "Boolean", "File"] as const;
export type ListField = {
  id: number;
  label: string;
  description: string;
  isIdentifier: boolean;
  type: (typeof FieldTypes)[number];
};
export interface IListMetadata {
  title: string;
  description: string;
  itemName: string;
  itemNamePlural: string;
  logoURI?: string;
  policyURI?: string;
  isListOfLists?: boolean;
  columns: ListField[];
}

export enum ListProgress {
  ConfirmingDeploy,
  ConfirmedDeploy,
  Deployed,
  ConfirmingSubmit,
  ConfirmedSubmit,
  SubmitSuccess,
  Failed,
}

export interface IListData extends IList {
  courtId?: string;
  numberOfJurors: number;
  submissionBaseDeposit: string;
  removalBaseDeposit: string;
  submissionChallengeBaseDeposit: string;
  removalChallengeBaseDeposit: string;
  arbitrationCost?: string;
  deployCost?: string;
}

const initialListData: Partial<IListData> = {
  governor: "",
  arbitrator: KLEROS_ARBITRATOR,
  numberOfJurors: 3,
  submissionBaseDeposit: "0.00001",
  removalBaseDeposit: "0.00001",
  submissionChallengeBaseDeposit: "0.00001",
  removalChallengeBaseDeposit: "0.00001",
  evidenceModule: EVIDENCE_MODULE,
  challengePeriodDuration: 2, //hrs
};

const initialListMetadata: Partial<IListMetadata> = {
  title: "",
  description: "",
  columns: [{ label: "", description: "", type: "Text", isIdentifier: true, id: 0 }],
};

interface ISubmitListContext {
  listData: IListData;
  setListData: (listData: IListData) => void;
  listMetadata: IListMetadata;
  setListMetadata: (listMetadata: IListMetadata) => void;
  resetListData: () => void;
  isSubmittingList: boolean;
  setIsSubmittingList: (isSubmittingList: boolean) => void;
  isPolicyUploading: boolean;
  setIsPolicyUploading: (isPolicyUploading: boolean) => void;
  isLogoUploading: boolean;
  setIsLogoUploading: (isLogoUploading: boolean) => void;
  progress: ListProgress;
  setProgress: (progress: ListProgress) => void;
}

const SubmitListContext = createContext<ISubmitListContext>({
  listData: initialListData as IListData,
  setListData: () => {},
  listMetadata: initialListMetadata as IListMetadata,
  setListMetadata: () => {},
  resetListData: () => {},
  isSubmittingList: false,
  setIsSubmittingList: () => {},
  isPolicyUploading: false,
  setIsPolicyUploading: () => {},
  isLogoUploading: false,
  setIsLogoUploading: () => {},
  progress: ListProgress.ConfirmingDeploy,
  setProgress: () => {},
});

export const useSubmitListContext = () => useContext(SubmitListContext);

export const SubmitListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listData, setListData] = useLocalStorage<IListData>("listData", initialListData as IListData);
  const [listMetadata, setListMetadata] = useLocalStorage<IListMetadata>(
    "listMetadata",
    initialListMetadata as IListMetadata
  );
  const [isSubmittingList, setIsSubmittingList] = useState<boolean>(false);
  const [isPolicyUploading, setIsPolicyUploading] = useState<boolean>(false);
  const [isLogoUploading, setIsLogoUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<ListProgress>(ListProgress.ConfirmingDeploy);

  const resetListData = () => {
    setListData(initialListData);
    setListMetadata(initialListMetadata);
  };

  const contextValues = useMemo(
    () => ({
      listData,
      setListData,
      listMetadata,
      setListMetadata,
      resetListData,
      isSubmittingList,
      setIsSubmittingList,
      isPolicyUploading,
      setIsPolicyUploading,
      isLogoUploading,
      setIsLogoUploading,
      progress,
      setProgress,
    }),
    [listData, listMetadata, resetListData, isSubmittingList, isPolicyUploading, isLogoUploading, progress]
  );

  return <SubmitListContext.Provider value={contextValues}>{children}</SubmitListContext.Provider>;
};
