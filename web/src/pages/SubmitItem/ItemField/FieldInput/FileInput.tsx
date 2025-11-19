import React from "react";
import { IFieldInput } from ".";
import { FileUploader } from "@kleros/ui-components-library";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { cn, getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";

const landscapeWitdhCalc = "lg:w-[calc(200px+(720-200)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";
const marginBottomCalc = "mb-[calc(150px+(72-150)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

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
    <FileUploader
      className={cn(
        "w-[84vw]",
        "[&_small]:whitespace-pre-line [&_small]:text-start",
        marginBottomCalc,
        landscapeWitdhCalc
      )}
      callback={handleFileUpload}
      variant={isDesktop ? "info" : undefined}
      msg={`${fieldProp.description}\n${getFileUploaderMsg(Roles.CurateItemFile, roleRestrictions)}`}
    />
  );
};

export default FileInput;
