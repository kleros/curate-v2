import React from "react";
import { IFieldInput } from ".";
import styled, { css } from "styled-components";
import { FileUploader } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { useAtlasProvider } from "context/AtlasProvider";
import { Roles } from "utils/atlas";

const StyledFileUploader = styled(FileUploader)`
  width: 84vw;
  margin-bottom: ${responsiveSize(52, 32)};
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(200, 720)};
    `
  )};
`;

const ImageInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const { uploadFile } = useAtlasProvider();
  const handleFileUpload = (file: File) => {
    uploadFile(file, Roles.CurateItemImage)
      .then(async (fileURI) => {
        if (!fileURI) return;
        handleWrite(fileURI);
      })
      .catch((err) => console.log(err))
      .finally();
  };

  return <StyledFileUploader callback={handleFileUpload} variant="info" msg={fieldProp.description} />;
};

export default ImageInput;
