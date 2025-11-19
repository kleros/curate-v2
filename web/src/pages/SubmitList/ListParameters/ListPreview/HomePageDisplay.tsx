import React, { useMemo } from "react";
import { responsiveSize } from "styles/responsiveSize";
import RegistryCard from "components/RegistryCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { Status } from "src/graphql/graphql";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { DEFAULT_LIST_LOGO } from "src/consts";

const HomePageDisplay: React.FC = () => {
  const { listMetadata } = useSubmitListContext();
  const previewData = useMemo(() => listMetadata, [listMetadata]);
  return (
    <div className="flex flex-col" style={{ gap: responsiveSize(32, 24) }}>
      <p className="m-0 text-klerosUIComponentsPrimaryBlue">Check how the list is displayed on the home page:</p>
      <RegistryCard
        id={"1"}
        title={previewData.title}
        status={mapFromSubgraphStatus(Status.RegistrationRequested, false)}
        logoURI={previewData?.logoURI ?? DEFAULT_LIST_LOGO}
        totalItems={23}
        overrideIsListView
      />
    </div>
  );
};
export default HomePageDisplay;
