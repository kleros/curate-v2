import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { FileUploader } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";
import { toast } from "react-toastify";
import ListPreview from "./ListPreview";
import { useAtlasProvider } from "context/AtlasProvider";
import { Roles } from "utils/atlas";

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
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file?.type)) {
      toast.error("File type not supported", toastOptions);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        if (image.width !== image.height) {
          toast.error("Image aspect ratio must be 1:1", toastOptions);
          return;
        }

        setIsLogoUploading(true);

        uploadFile(file, Roles.Logo)
          .then(async (logoURI) => {
            if (!logoURI) return;
            setListMetadata({ ...listMetadata, logoURI });
          })
          .catch((err) => console.log(err))
          .finally(() => setIsLogoUploading(false));
      };

      image.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };
  return (
    <Container>
      <Header text="Logo" />
      <StyledFileUploader
        callback={handleFileUpload}
        variant="info"
        msg="Upload a logo to represent your list. The logo should be a 1:1 aspect ratio image with transparent background, in SVG, or PNG."
      />
      <ListPreview />
      <NavigationButtons prevRoute="/submit-list/description" nextRoute="/submit-list/policy" />
    </Container>
  );
};
export default LogoUpload;
