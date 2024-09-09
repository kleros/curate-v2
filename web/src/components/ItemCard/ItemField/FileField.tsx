import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PDFIcon from "svgs/icons/pdf.svg";
import { getIpfsUrl } from "utils/getIpfsUrl";

const Container = styled(Link)`
  display: flex;
  gap: 8px;
`;

export interface IFileField {
  value: string;
  label: string;
  detailed?: boolean;
}

const FileField: React.FC<IFileField> = ({ value, label }) => {
  const fileUrl = getIpfsUrl(value);
  return (
    <Container to={`/attachment/?url=${fileUrl}`} onClick={(event) => event.stopPropagation()}>
      <PDFIcon />
      {label}
    </Container>
  );
};

export default FileField;
