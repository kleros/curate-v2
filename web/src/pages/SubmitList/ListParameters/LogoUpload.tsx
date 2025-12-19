import React from "react";
import NavigationButtons from "../NavigationButtons";
import { FileUploader } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import ListPreview from "./ListPreview";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";
import { BASE_CONTAINER_STYLE } from "../constants";

const LogoUpload: React.FC = () => {
  const { listMetadata, setListMetadata, setIsLogoUploading } = useSubmitListContext();

  const { uploadFile, roleRestrictions } = useAtlasProvider();
  const isDesktop = useIsDesktop();

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
    <div className={BASE_CONTAINER_STYLE}>
      <Header text="Logo" />
      <FileUploader
        className="w-full [&_small]:whitespace-pre-line [&_small]:text-sm"
        callback={handleLoad}
        variant={isDesktop ? "info" : undefined}
        msg={
          "Upload a logo to represent your list. The logo should be a 1:1 aspect ratio image with transparent background.\n" +
          (getFileUploaderMsg(Roles.Logo, roleRestrictions) ?? "")
        }
      />
      <ListPreview />
      <NavigationButtons prevRoute="/submit-list/description" nextRoute="/submit-list/policy" />
    </div>
  );
};
export default LogoUpload;
