import React from "react";

import { responsiveSize } from "styles/responsiveSize";

import Skeleton from "react-loading-skeleton";

import PolicyIcon from "svgs/icons/policy.svg";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { MAIN_CURATE_ADDRESS } from "src/consts";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { Link } from "react-router-dom";

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
      className="flex flex-col justify-center w-full py-6 mt-4 bg-klerosUIComponentsMediumBlue leading-6 lg:flex-row lg:justify-between"
      style={{ paddingInline: responsiveSize(24, 32) }}
    >
      <p className="text-sm leading-6 mt-0 mb-4 text-klerosUIComponentsPrimaryBlue lg:mb-0">
        Make sure you read and understand the Policies
      </p>
      <div className="flex flex-wrap" style={{ gap: responsiveSize(16, 24) }}>
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
