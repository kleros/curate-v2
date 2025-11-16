import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FileUploader, TextArea } from "@kleros/ui-components-library";
import LabeledInput from "components/LabeledInput";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";
import clsx from "clsx";

const fileUploaderMarginBottomCalc = "mb-[calc(150px+(72-150)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

export type Evidence = {
  name: string;
  description: string;
  fileURI: string;
  fileTypeExtension: string;
};

interface IEvidenceUpload {
  setEvidence: Dispatch<SetStateAction<Evidence | undefined>>;
  setIsEvidenceUploading: Dispatch<SetStateAction<boolean>>;
}

const EvidenceUpload: React.FC<IEvidenceUpload> = ({ setEvidence, setIsEvidenceUploading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileURI, setFileURI] = useState("");
  const { uploadFile, roleRestrictions } = useAtlasProvider();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setEvidence({
      name: title,
      description,
      fileURI,
      fileTypeExtension: "pdf",
    });
  }, [title, description, fileURI]);

  const handleFileUpload = (file: File) => {
    setIsEvidenceUploading(true);
    infoToast("Uploading to IPFS...");
    uploadFile(file, Roles.Evidence)
      .then(async (fileURI) => {
        if (!fileURI) throw new Error("Error uploading file to IPFS");
        setFileURI(fileURI);
        successToast("Uploaded successfully!");
      })
      .catch((err) => {
        console.log(err);
        errorToast(`Upload failed: ${err?.message}`);
      })
      .finally(() => setIsEvidenceUploading(false));
  };

  return (
    <div className="flex flex-col gap-9 w-full py-1.5">
      <LabeledInput
        topLeftLabel={{ text: "Title" }}
        placeholder="eg. The item is not legit."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <div className="flex flex-col gap-3">
        <label className="text-klerosUIComponentsPrimaryText">Description</label>
        <TextArea
          className="w-full h-[180px]"
          placeholder="Explain what motivates you to challenge it. Why do you think the item is not compliant with the Policy?"
          value={description}
          onChange={(value) => setDescription(value)}
        />
      </div>
      <FileUploader
        className={clsx("w-full [&_small]:whitespace-pre-line [&_small]:text-start", fileUploaderMarginBottomCalc)}
        callback={handleFileUpload}
        variant={isDesktop ? "info" : undefined}
        msg={
          "Additionally, you can add an external file.\n" + (getFileUploaderMsg(Roles.Evidence, roleRestrictions) ?? "")
        }
      />
    </div>
  );
};

export default EvidenceUpload;
