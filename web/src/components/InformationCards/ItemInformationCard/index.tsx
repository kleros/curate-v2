import React from "react";
import { Card, Copiable } from "@kleros/ui-components-library";
import Skeleton from "react-loading-skeleton";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import ActionButton from "components/ActionButton";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { responsiveSize } from "styles/responsiveSize";
import { Policies } from "../RegistryInformationCard/Policies";
import FieldsDisplay from "./FieldsDisplay";
import StatusDisplay from "../StatusDisplay";
import { ItemDetailsQuery } from "src/graphql/graphql";
import { Address } from "viem";
import { validateItem } from "src/types/CurateItem";
import { cn, isUndefined } from "src/utils";

type ItemDetails = NonNullable<ItemDetailsQuery["item"]>;
interface IItemInformationCard extends ItemDetails {
  className?: string;
  policyURI: string;
  registryAddress: Address;
  isPreview?: boolean;
}

const aliasContainerStyle = "flex flex-wrap gap-2 items-center";

const ItemInformationCard: React.FC<IItemInformationCard> = ({
  className,
  registerer,
  status,
  disputed,
  policyURI,
  itemID,
  props,
  registryAddress,
  latestRequestSubmissionTime,
  data,
  isPreview = false,
}) => {
  const showWarning = isPreview || isUndefined(data) ? false : !validateItem(data).success;

  return (
    <Card className={cn("flex flex-col w-full h-auto mb-16", className)}>
      {showWarning ? (
        <p className="w-full py-1 px-8 bg-klerosUIComponentsWarningLight text-sm font-medium text-center text-klerosUIComponentsWarning">
          This item does not pass the validation checks. Please review carefully.
        </p>
      ) : null}
      <div className="flex justify-between flex-wrap gap-3 py-3 px-8 lg:flex-nowrap">
        <div className="flex grow flex-col flex-wrap gap-4 pt-4">
          {props ? <FieldsDisplay {...{ props, registryAddress }} /> : <Skeleton height={80} width={160} />}
        </div>
        <div className="flex flex-row items-start gap-12 pt-5 shrink lg:shrink-0">
          <Copiable copiableContent={itemID ?? ""} info="Copy Item Id" iconPlacement="left">
            <label className="text-klerosUIComponentsPrimaryBlue">Item Id</label>
          </Copiable>
          <StatusDisplay {...{ status, disputed, registryAddress, latestRequestSubmissionTime }} />
        </div>
      </div>
      <hr
        className="border-none h-px bg-klerosUIComponentsStroke mx-8"
        style={{ marginBlock: responsiveSize(20, 28) }}
      />
      <div className="flex px-8 pb-3 flex-wrap gap-3 justify-between">
        {registerer?.id ? (
          <div className={aliasContainerStyle}>
            <small className="text-sm font-semibold leading-18px text-klerosUIComponentsPrimaryText">
              Submitted by:
            </small>
            <Copiable copiableContent={registerer.id}>
              <div className={aliasContainerStyle}>
                <AliasDisplay address={registerer.id} />
              </div>
            </Copiable>
          </div>
        ) : (
          <Skeleton height={24} />
        )}
        <ActionButton
          {...{
            status: mapFromSubgraphStatus(status, disputed),
            itemId: itemID,
            registryAddress,
            isItem: true,
          }}
        />
      </div>
      <Policies policyURI={policyURI} isItem />
    </Card>
  );
};
export default ItemInformationCard;
