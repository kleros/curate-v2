import React from "react";
import { IFieldInput } from ".";
import styled, { css } from "styled-components";
import { FileUploader } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";

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
const FileInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const { uploadFile } = useAtlasProvider();
  const handleFileUpload = (file: File) => {
    infoToast("Uploading to IPFS...");
    uploadFile(file, Roles.CurateItemFile)
      .then(async (fileURI) => {
        if (!fileURI) return;
        successToast("Uploaded successfully!");
        handleWrite(fileURI);
      })
      .catch((err) => {
        console.log(err);
        errorToast(`Upload failed: ${err?.message}`);
      });
  };

  return <StyledFileUploader callback={handleFileUpload} variant="info" msg={fieldProp.description} />;
};

export default FileInput;
