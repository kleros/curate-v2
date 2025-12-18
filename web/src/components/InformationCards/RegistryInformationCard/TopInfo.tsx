import React, { useEffect, useState } from "react";
import { Copiable } from "@kleros/ui-components-library";
import Skeleton from "react-loading-skeleton";
import { RegistryDetails } from "context/RegistryDetailsContext";
import StatusDisplay from "../StatusDisplay";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "src/consts/chains";
import { isUndefined } from "src/utils";
import { DEFAULT_LIST_LOGO } from "src/consts";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { shortenAddress } from "utils/shortenAddress";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface ITopInfo
  extends Pick<
    RegistryDetails,
    "description" | "title" | "logoURI" | "status" | "disputed" | "id" | "latestRequestSubmissionTime"
  > {
  registryAddress: string;
}

const TopInfo: React.FC<ITopInfo> = ({
  id,
  title,
  description,
  logoURI,
  status,
  disputed,
  latestRequestSubmissionTime,
  registryAddress,
}) => {
  const [imageSrc, setImageSrc] = useState(getIpfsUrl(logoURI ?? ""));
  useEffect(() => setImageSrc(getIpfsUrl(logoURI ?? "")), [logoURI]);
  return (
    <div className="flex flex-wrap justify-between gap-3 lg:flex-nowrap pb-3 pt-fluid-20-24 px-fluid-24-32">
      <div className="flex flex-col gap-y-fluid-8-16">
        <div className="flex flex-wrap items-center gap-4">
          {isUndefined(logoURI) ? (
            <Skeleton width={125} height={125} borderRadius="62.5px" className="mb-2" />
          ) : (
            <Link to={`/attachment/?url=${imageSrc}`}>
              <img
                className="object-contain mb-2 w-[125px] h-[125px]"
                src={imageSrc}
                onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
                alt="List Img"
              />
            </Link>
          )}
          {isUndefined(title) ? <Skeleton width={180} height={30} /> : <h1>{title}</h1>}
        </div>
        {isUndefined(description) ? (
          <Skeleton width="90%" height={21} />
        ) : (
          <p className="text-klerosUIComponentsSecondaryText">{description}</p>
        )}
      </div>
      <div
        className={clsx(
          "flex flex-row flex-wrap shrink gap-8 items-start pt-5",
          "lg:shrink-0 lg:gap-x-fluid-24-32-900 lg:gap-y-0"
        )}
      >
        {id !== "" ? (
          <Copiable
            copiableContent={id}
            info="Copy Registry Address"
            iconPlacement="left"
            tooltipProps={{
              small: true,
            }}
          >
            <a
              className="hover:underline leading-4"
              href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${id}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortenAddress(id)}
            </a>
          </Copiable>
        ) : (
          <Skeleton width={80} height={16} />
        )}
        <StatusDisplay {...{ status, disputed, registryAddress, latestRequestSubmissionTime }} />
      </div>
    </div>
  );
};

export default TopInfo;
