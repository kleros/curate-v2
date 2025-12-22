import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FileUploader, TextArea, TextField } from "@kleros/ui-components-library";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";
import { Evidence } from "src/types/Evidence";
import { getFileExtension } from "utils/getFileExtension";

interface IEvidenceUpload {
  setEvidence: Dispatch<SetStateAction<Evidence | undefined>>;
  setIsEvidenceUploading: Dispatch<SetStateAction<boolean>>;
}

const EvidenceUpload: React.FC<IEvidenceUpload> = ({ setEvidence, setIsEvidenceUploading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileURI, setFileURI] = useState<string>();
  const [fileTypeExtension, setFileTypeExtension] = useState<string>();
  const { uploadFile, roleRestrictions } = useAtlasProvider();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setEvidence({
      name: title,
      description,
      fileURI,
      fileTypeExtension,
    });
  }, [title, description, fileURI]);

  const handleFileUpload = async (file: File) => {
    setIsEvidenceUploading(true);
    infoToast("Uploading to IPFS...");

    try {
      const [fileURI, ext] = await Promise.all([uploadFile(file, Roles.Evidence), getFileExtension(file)]);

      if (!fileURI) {
        throw new Error("Error uploading file to IPFS");
      }

      setFileURI(fileURI);
      if (ext) setFileTypeExtension(ext);

      successToast("Uploaded successfully!");
    } catch (err) {
      console.error(err);
      errorToast(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsEvidenceUploading(false);
    }
  };
  return (
    <div className="flex flex-col gap-9 w-full py-1.5">
      <TextField
        className="w-full"
        label="Title"
        placeholder="eg. The item is not legit."
        value={title}
        onChange={(value) => setTitle(value)}
      />
      <TextArea
        label="Description"
        id="evidence-description"
        className="w-full [&_textarea]:w-full [&_textarea]:h-[180px]"
        placeholder="Explain what motivates you to challenge it. Why do you think the item is not compliant with the Policy?"
        value={description}
        onChange={(value) => setDescription(value)}
      />
      <FileUploader
        className="w-full [&_small]:whitespace-pre-line [&_small]:text-start"
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
