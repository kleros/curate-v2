import React, { useEffect, useState } from "react";
import { responsiveSize } from "styles/responsiveSize";
import Skeleton from "react-loading-skeleton";
import { Button } from "@kleros/ui-components-library";
import ArrowIcon from "svgs/icons/arrow.svg";
import { Status } from "consts/status";
import { getIpfsUrl } from "utils/getIpfsUrl";
import StatusBanner from "./StatusBanner";
import { DEFAULT_LIST_LOGO } from "consts/index";
import TruncatedText from "../TruncatedText";
import { cn } from "~src/utils";

interface IListInfo {
  title?: string;
  totalItems: number;
  logoURI?: string;
  status: Status;
  isListView?: boolean;
}

const ListInfo: React.FC<IListInfo> = ({ title, totalItems, logoURI, status, isListView = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(getIpfsUrl(logoURI ?? DEFAULT_LIST_LOGO));

  useEffect(() => {
    if (!logoURI) return;
    setImageSrc(getIpfsUrl(logoURI));
  }, [logoURI]);

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-2 h-[calc(100%-45px)]",
        isListView && [
          "grid grid-cols-[21px_max.content_1fr_max-content] grid-rows-[repeat(3,min-content)] gap-y-4",
          "w-full h-max lg:h-16 p-4",
          "[&_h3]:col-span-4 [&_img]:col-span-4",
          "lg:justify-between lg:grid-rows-[1fr] lg:px-8",
          "lg:grid-cols-[auto_1fr_calc(80px+(100-80)*(min(max(100vw,900px),1250px)-900px)/(1250-900))_calc(100px+(150-100)*(min(max(100vw,900px),1250px)-900px)/(1250-900))_max-content]",
          "lg:[&_img]:col-span-1 lg:[&_h3]:col-span-2",
        ]
      )}
      style={{ columnGap: isListView ? responsiveSize(8, 24, 900) : undefined }}
    >
      {!imageLoaded ? (
        <Skeleton
          className={cn(isListView ? "mb-0" : "mb-2")}
          height={isListView ? 40 : 125}
          width={isListView ? 40 : 125}
          borderRadius={isListView ? "24px" : "62.5px"}
        />
      ) : null}
      <img
        className={cn("object-contain", isListView ? "w-10 h-10 mb-0" : "w-[125px] h-[125px] mb-2")}
        src={imageSrc}
        alt="List Img"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
        style={{ display: imageLoaded ? "block" : "none" }}
      />
      <TruncatedText text={title ?? ""} maxLength={100} />
      <label className="text-klerosUIComponentsSecondaryText">{totalItems} items</label>
      {isListView && <StatusBanner {...{ status, isListView }} />}
      {isListView && (
        <Button
          className={cn(
            "flex-row-reverse gap-2 p-0 bg-transparent",
            "focus:bg-transparent hover:bg-transparent",
            "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:font-normal [&_.button-svg]:fill-klerosUIComponentsSecondaryPurple"
          )}
          text="Open"
          Icon={ArrowIcon}
        />
      )}
    </div>
  );
};

export default ListInfo;
