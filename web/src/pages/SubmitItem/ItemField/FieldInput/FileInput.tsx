import React from "react";
import { IFieldInput } from ".";
import { toast } from "react-toastify";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";
import styled, { css } from "styled-components";
import { FileUploader } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";

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
  const handleFileUpload = (file: File) => {
    if (file?.type !== "application/pdf") {
      toast.error("File type not supported", toastOptions);
      return;
    }

    uploadFileToIPFS(file)
      .then(async (res) => {
        const response = await res.json();
        const fileURI = response["cids"][0];
        handleWrite(fileURI);
      })
      .catch((err) => console.log(err))
      .finally();
  };

  return <StyledFileUploader callback={handleFileUpload} variant="info" msg={fieldProp.description} />;
};

export default FileInput;
