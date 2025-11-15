import React from "react";
import { Link } from "react-router-dom";
import { getIpfsUrl } from "utils/getIpfsUrl";

export interface IImageField {
  value: string;
  detailed?: boolean;
}

const ImageField: React.FC<IImageField> = ({ value, detailed }) => {
  const imgUrl = getIpfsUrl(value);
  return (
    <Link to={`/attachment/?url=${imgUrl}`}>
      <img
        className="object-contain"
        width={detailed ? 125 : 40}
        height={detailed ? 125 : 40}
        src={imgUrl}
        alt="Item image"
      />
    </Link>
  );
};

export default ImageField;
