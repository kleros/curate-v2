import React from "react";
import { Link } from "react-router-dom";
import PDFIcon from "svgs/icons/pdf.svg";
import { getIpfsUrl } from "utils/getIpfsUrl";

export interface IFileField {
  value: string;
  label: string;
  detailed?: boolean;
}

const FileField: React.FC<IFileField> = ({ value, label }) => {
  const fileUrl = getIpfsUrl(value);
  return (
    <Link className="flex gap-2" to={`/attachment/?url=${fileUrl}`} onClick={(event) => event.stopPropagation()}>
      <PDFIcon />
      {label}
    </Link>
  );
};

export default FileField;
