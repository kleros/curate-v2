import React from "react";
import styled from "styled-components";
import PDFIcon from "svgs/icons/pdf.svg";
import { getIpfsUrl } from "utils/getIpfsUrl";

const Container = styled.a`
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
    <Container href={fileUrl} onClick={(event) => event.stopPropagation()} target="blank" rel="noreferrer">
      <PDFIcon />
      {label}
    </Container>
  );
};

export default FileField;
