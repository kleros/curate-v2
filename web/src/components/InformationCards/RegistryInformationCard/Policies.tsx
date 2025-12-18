import React from "react";

import Skeleton from "react-loading-skeleton";

import PolicyIcon from "svgs/icons/policy.svg";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { MAIN_CURATE_ADDRESS } from "src/consts";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { Link } from "react-router-dom";
import clsx from "clsx";

const internalLinkStyle =
  "flex gap-1 items-center transition duration-100 hover:[&_svg]:fill-klerosUIComponentsSecondaryBlue";

interface IPolicies {
  policyURI: string;
  isItem?: boolean;
}

export const Policies: React.FC<IPolicies> = ({ policyURI, isItem }) => {
  const { data: parentRegistryDetails } = useRegistryDetailsQuery(MAIN_CURATE_ADDRESS);

  return (
    <div
      className={clsx(
        "flex flex-col justify-center lg:flex-row lg:justify-between",
        "w-full py-6 px-fluid-24-32 mt-4 bg-klerosUIComponentsMediumBlue leading-6"
      )}
    >
      <p className="text-sm leading-6 text-klerosUIComponentsPrimaryBlue mb-4 lg:mb-0">
        Make sure you read and understand the Policies
      </p>
      <div className="flex flex-wrap gap-fluid-16-24">
        {!isItem ? (
          <>
            {parentRegistryDetails ? (
              <Link
                className={internalLinkStyle}
                to={`/attachment/?url=${getIpfsUrl(parentRegistryDetails.registry.policyURI ?? "")}`}
              >
                <PolicyIcon width={16} className="fill-klerosUIComponentsPrimaryBlue" />
                Curation Policy
              </Link>
            ) : (
              <Skeleton width={116} />
            )}
          </>
        ) : null}
        {policyURI ? (
          <Link className={internalLinkStyle} to={`/attachment/?url=${getIpfsUrl(policyURI)}`}>
            <PolicyIcon width={16} className="fill-klerosUIComponentsPrimaryBlue" />
            List Policy
          </Link>
        ) : (
          <Skeleton width={80} />
        )}
      </div>
    </div>
  );
};
