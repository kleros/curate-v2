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

const ImageInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleFileUpload = (file: File) => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file?.type)) {
      toast.error("File type not supported", toastOptions);
      return;
    }

    uploadFileToIPFS(file)
      .then(async (res) => {
        const response = await res.json();
        const imageURI = response["cids"][0];
        handleWrite(imageURI);
      })
      .catch((err) => console.log(err))
      .finally();
  };

  return <StyledFileUploader callback={handleFileUpload} variant="info" msg={fieldProp.description} />;
};

export default ImageInput;
