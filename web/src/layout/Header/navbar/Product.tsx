import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

import { responsiveSize } from "styles/responsiveSize";

interface IProduct {
  text: string;
  url: string;
  Icon: React.FC<React.SVGAttributes<SVGElement>> | string;
}

const Product: React.FC<IProduct> = ({ text, url, Icon }) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      className={
        "flex flex-col items-center cursor-pointer pt-4 pb-7 px-2 max-w-[100px] rounded-[3px] gap-2 bg-klerosUIComponentsLightBackground" +
        `w-[${responsiveSize(
          100,
          130
        )}] hover:transition-[transform_0.15s,background-color_0.3s] hover:scale-[1.02] hover:bg-klerosUIComponentsLightGrey`
      }
    >
      {typeof Icon === "string" ? (
        <>
          {!isImgLoaded ? <Skeleton width={48} height={46} circle /> : null}
          <img
            className={`w-12 h-12 ${isImgLoaded ? "block" : "none"}`}
            alt={Icon}
            src={Icon}
            onLoad={() => setIsImgLoaded(true)}
          />
        </>
      ) : (
        <Icon className="w-12 h-12" />
      )}
      <small className="flex font-normal text-center leading-[19px]">{text}</small>
    </a>
  );
};

export default Product;
