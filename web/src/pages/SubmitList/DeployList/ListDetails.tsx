import React from "react";
import Coin from "svgs/icons/pile-coins.svg";
import { getChainIcon, getChainName } from "components/ChainIcon";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { formatValue } from "utils/format";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import { DEFAULT_CHAIN } from "src/consts/chains";

const ListDetails: React.FC = () => {
  const { listMetadata, listData, progress } = useSubmitListContext();
  return (
    <div
      className={clsx(
        "flex flex-col gap-5 w-full",
        "justify-start items-start",
        "p-fluid-24-32 pb-2 border-b border-klerosUIComponentsStroke",
        "lg:flex-row lg:justify-between lg:items-center lg:gap-0 lg:pb-4"
      )}
    >
      <h1
        className={clsx(
          "text-klerosUIComponentsSecondaryPurple",
          "after:content-['list'] after:ml-2 after:text-klerosUIComponentsPrimaryText"
        )}
      >
        {listMetadata.title}
      </h1>
      <div className="flex flex-wrap justify-between gap-y-0 gap-x-12">
        {progress !== ListProgress.SubmitSuccess && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center justify-center">
              <Coin width={16} height={16} className="fill-klerosUIComponentsSecondaryPurple" />
            </div>
            <>
              <p>Total :</p>
              {listData.deployCost ? (
                <p className="text-klerosUIComponentsSecondaryPurple">
                  ~{formatValue(listData.deployCost, 5, false)} ETH
                </p>
              ) : (
                <Skeleton width={60} height={20} />
              )}
            </>
          </div>
        )}
        <div className="flex gap-2 items-center justify-center">
          <p>{getChainIcon(DEFAULT_CHAIN)}</p>
          <p>{getChainName(DEFAULT_CHAIN)}</p>
        </div>
      </div>
    </div>
  );
};

export default ListDetails;
