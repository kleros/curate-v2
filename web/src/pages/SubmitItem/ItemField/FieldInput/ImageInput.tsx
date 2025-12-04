import React from "react";
import { IFieldInput } from ".";
import { FileUploader } from "@kleros/ui-components-library";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { cn, getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";
import { LANDSCAPE_WIDTH_CALC, MARGIN_BOTTOM_CALC } from "./constants";

const ImageInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const { uploadFile, roleRestrictions } = useAtlasProvider();
  const isDesktop = useIsDesktop();

  const handleFileUpload = (file: File) => {
    infoToast("Uploading to IPFS...");

    uploadFile(file, Roles.CurateItemImage)
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
    <FileUploader
      className={cn(
        "w-[84vw]",
        "[&_small]:whitespace-pre-line [&_small]:text-start",
        MARGIN_BOTTOM_CALC,
        LANDSCAPE_WIDTH_CALC
      )}
      callback={handleFileUpload}
      variant={isDesktop ? "info" : undefined}
      msg={`${fieldProp.description}\n${getFileUploaderMsg(Roles.CurateItemImage, roleRestrictions)}`}
    />
  );
};

export default ImageInput;
