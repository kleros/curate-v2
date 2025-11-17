import React, { useEffect, useState } from "react";
import { Copiable } from "@kleros/ui-components-library";
import Skeleton from "react-loading-skeleton";
import { RegistryDetails } from "context/RegistryDetailsContext";
import StatusDisplay from "../StatusDisplay";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "src/consts/chains";
import { responsiveSize } from "src/styles/responsiveSize";
import { isUndefined } from "src/utils";
import { DEFAULT_LIST_LOGO } from "src/consts";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { shortenAddress } from "utils/shortenAddress";
import { Link } from "react-router-dom";

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
    <div
      className="flex flex-wrap justify-between gap-3 lg:flex-nowrap pb-3"
      style={{ paddingTop: responsiveSize(20, 24), paddingInline: responsiveSize(24, 32) }}
    >
      <div className="flex flex-col" style={{ rowGap: responsiveSize(8, 16) }}>
        <div className="flex flex-wrap items-center gap-4">
          {isUndefined(logoURI) ? (
            <Skeleton width={125} height={125} borderRadius="62.5px" className="mb-2" />
          ) : (
            <Link to={`/attachment/?url=${imageSrc}`}>
              <img
                width={125}
                height={125}
                className="object-contain mb-2"
                src={imageSrc}
                onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
                alt="List Img"
              />
            </Link>
          )}
          {isUndefined(title) ? <Skeleton width={180} height={30} /> : <h1 className="m-0">{title}</h1>}
        </div>
        {isUndefined(description) ? (
          <Skeleton width="90%" height={21} />
        ) : (
          <p className="m-0 text-klerosUIComponentsSecondaryText no-underline hover:underline">{description}</p>
        )}
      </div>
      <div
        className="flex flex-row flex-wrap shrink gap-8 items-start pt-5 lg:shrink-0"
        style={{ columnGap: responsiveSize(24, 32, 900) }}
      >
        {id !== "" ? (
          <Copiable copiableContent={id} info="Copy Registry Address" iconPlacement="left">
            <a
              className="text-klerosUIComponentsPrimaryBlue"
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
