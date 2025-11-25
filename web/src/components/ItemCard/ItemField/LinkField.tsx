import React from "react";
import Globe from "svgs/icons/globe.svg";

export interface ILinkField {
  value: string;
  detailed?: boolean;
}

const LinkField: React.FC<ILinkField> = ({ value }) => {
  return (
    <a
      className="flex gap-2"
      href={value}
      onClick={(event) => event.stopPropagation()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Globe />
      {value}
    </a>
  );
};

export default LinkField;
