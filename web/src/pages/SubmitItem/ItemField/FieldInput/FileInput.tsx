import React from "react";
import { IFieldInput } from ".";
import styled, { css } from "styled-components";
import { FileUploader } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";

const StyledFileUploader = styled(FileUploader)`
  width: 84vw;
  margin-bottom: ${responsiveSize(150, 72)};
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
  small {
    white-space: pre-line;
    text-align: start;
  }
  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(200, 720)};
    `
  )};
`;
const FileInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const { uploadFile, roleRestrictions } = useAtlasProvider();
  const isDesktop = useIsDesktop();

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

  return (
    <StyledFileUploader
      callback={handleFileUpload}
      variant={isDesktop ? "info" : undefined}
      msg={`${fieldProp.description}\n${getFileUploaderMsg(Roles.CurateItemFile, roleRestrictions)}`}
    />
  );
};

export default FileInput;
