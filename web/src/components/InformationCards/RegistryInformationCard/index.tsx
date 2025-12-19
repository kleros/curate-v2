import React from "react";
import { Card, Copiable } from "@kleros/ui-components-library";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { Policies } from "./Policies";
import ActionButton from "../../ActionButton";
import TopInfo from "./TopInfo";
import { RegistryDetails } from "context/RegistryDetailsContext";
import { validateList } from "src/types/ListMetadata";
import { cn } from "src/utils";

interface IInformationCard
  extends Pick<
    RegistryDetails,
    | "title"
    | "description"
    | "logoURI"
    | "disputed"
    | "registerer"
    | "status"
    | "policyURI"
    | "latestRequestSubmissionTime"
    | "metadata"
  > {
  id: string;
  itemId: string;
  parentRegistryAddress: string;
  isPreview?: boolean;
  className?: string;
}

const RegistryInformationCard: React.FC<IInformationCard> = ({
  id,
  title,
  logoURI,
  description,
  registerer,
  status,
  disputed,
  policyURI,
  className,
  itemId,
  parentRegistryAddress,
  latestRequestSubmissionTime,
  metadata,
  isPreview = false,
}) => {
  const showWarning = isPreview || !metadata ? false : !validateList(metadata).success;
  return (
    <Card className={cn("flex flex-col w-full h-auto mb-16", className)}>
      {showWarning ? (
        <p
          className={cn(
            "w-full py-2 px-8 bg-klerosUIComponentsWarningLight",
            "text-sm font-medium text-center text-klerosUIComponentsWarning"
          )}
        >
          This list does not pass the validation checks. Please review carefully.
        </p>
      ) : null}
      <TopInfo
        {...{
          id,
          title,
          description,
          logoURI,
          status,
          disputed,
          latestRequestSubmissionTime,
          registryAddress: parentRegistryAddress,
        }}
      />
      <hr className="border-none h-px bg-klerosUIComponentsStroke my-fluid-20-28 mx-fluid-24-32" />
      <div className="flex flex-wrap justify-between gap-5 pb-3 px-fluid-24-32">
        <div className="flex flex-wrap gap-2 items-center leading-18px">
          <small className="text-sm font-semibold leading-18px text-klerosUIComponentsPrimaryText">Submitted by:</small>
          <Copiable copiableContent={registerer?.id ?? ""} tooltipProps={{ small: true }}>
            <AliasDisplay address={registerer?.id} />
          </Copiable>
        </div>
        <ActionButton
          {...{
            status: mapFromSubgraphStatus(status, disputed),
            registryAddress: parentRegistryAddress as `0x${string}`,
            itemId,
            isItem: false,
          }}
        />
      </div>
      <Policies policyURI={policyURI ?? ""} />
    </Card>
  );
};

export default RegistryInformationCard;
