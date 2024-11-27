import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { FileUploader } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import ListPreview from "./ListPreview";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(442, 700, 900)};
    `
  )}
`;

const StyledFileUploader = styled(FileUploader)`
  width: 100%;
  margin-bottom: ${responsiveSize(52, 32)};
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const LogoUpload: React.FC = () => {
  const { listMetadata, setListMetadata, setIsLogoUploading } = useSubmitListContext();

  const { uploadFile } = useAtlasProvider();

  const handleFileUpload = (file: File) => {
    setIsLogoUploading(true);
    infoToast("Uploading to IPFS...");

    uploadFile(file, Roles.Logo)
      .then(async (logoURI) => {
        if (!logoURI) return;
        successToast("Uploaded successfully!");
        setListMetadata({ ...listMetadata, logoURI });
      })
      .catch((err) => {
        console.log(err);
        errorToast(`Upload failed: ${err?.message}`);
      })
      .finally(() => setIsLogoUploading(false));
  };

  const handleLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        if (image.width !== image.height) {
          errorToast("Image aspect ratio must be 1:1");
          return;
        }
        handleFileUpload(file);
      };

      image.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };
  return (
    <Container>
      <Header text="Logo" />
      <StyledFileUploader
        callback={handleLoad}
        variant="info"
        msg="Upload a logo to represent your list. The logo should be a 1:1 aspect ratio image with transparent background, in SVG, or PNG."
      />
      <ListPreview />
      <NavigationButtons prevRoute="/submit-list/description" nextRoute="/submit-list/policy" />
    </Container>
  );
};
export default LogoUpload;
