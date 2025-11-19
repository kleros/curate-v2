import React, { useMemo } from "react";
import { responsiveSize } from "styles/responsiveSize";
import RegistryInformationCard from "components/InformationCards/RegistryInformationCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { Status } from "src/graphql/graphql";
import { DEFAULT_LIST_LOGO, MAIN_CURATE_ADDRESS } from "src/consts";
import { useAccount } from "wagmi";

const ListPageDisplay: React.FC = () => {
  const { listMetadata } = useSubmitListContext();
  const { address } = useAccount();
  const previewData = useMemo(() => listMetadata, [listMetadata]);

  return (
    <div className="flex flex-col" style={{ gap: responsiveSize(32, 24) }}>
      <p className="m-0 text-klerosUIComponentsPrimaryBlue">Check how the list is displayed on the List page:</p>
      <RegistryInformationCard
        className="m-0"
        id={MAIN_CURATE_ADDRESS}
        parentRegistryAddress={MAIN_CURATE_ADDRESS}
        registerer={{ id: address }}
        itemId=""
        title={previewData.title}
        description={previewData.description}
        status={Status.Registered}
        disputed={false}
        logoURI={previewData.logoURI ?? DEFAULT_LIST_LOGO}
        policyURI="https://cdn.kleros.link/ipfs/QmSxGYpXHBWBGvGnBeZD1pFxh8fRHj4Z7o3fBzrGiqNx4v/tokens-policy.pdf"
        isPreview
      />
    </div>
  );
};
export default ListPageDisplay;
