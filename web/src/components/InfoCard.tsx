import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import InfoCircle from "svgs/icons/info-circle.svg";
import { cn } from "src/utils";

interface IInfoCard {
  msg: string;
  className?: string;
}

const InfoCard: React.FC<IInfoCard> = ({ msg, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[16px_auto] items-center justify-start text-start text-klerosUIComponentsSecondaryText",
        className
      )}
      style={{ gap: responsiveSize(6, 8, 300) }}
    >
      <InfoCircle />
      {msg}
    </div>
  );
};

export default InfoCard;
