import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import InfoCircle from "svgs/icons/info-circle.svg";

interface IInfoCard {
  msg: string;
  className?: string;
}

const InfoCard: React.FC<IInfoCard> = ({ msg, className }) => {
  return (
    <div
      className={`grid grid-cols-[16px_auto] gap-${responsiveSize(
        6,
        8,
        300
      )} items-center justify-start text-start text-klerosUIComponentsSecondaryText ${className}`}
    >
      <InfoCircle />
      {msg}
    </div>
  );
};

export default InfoCard;
