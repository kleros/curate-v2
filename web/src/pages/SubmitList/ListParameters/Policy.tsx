import React from "react";
import NavigationButtons from "../NavigationButtons";
import { FileUploader } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { Link } from "react-router-dom";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { cn, getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";
import {
  BASE_CONTAINER_LANDSCAPE_WIDTH_CALC,
  BASE_CONTAINER_STYLE,
  FILE_UPLOADER_MARGIN_BOTTOM_CALC,
} from "../constants";

const Policy: React.FC = () => {
  const { listMetadata, setListMetadata, setIsPolicyUploading } = useSubmitListContext();
  const { uploadFile, roleRestrictions } = useAtlasProvider();
  const isDesktop = useIsDesktop();

  const handleFileUpload = (file: File) => {
    setIsPolicyUploading(true);
    infoToast("Uploading to IPFS...");

    uploadFile(file, Roles.Policy)
      .then(async (policyURI) => {
        if (!policyURI) return;
        successToast("Uploaded successfully!");
        setListMetadata({ ...listMetadata, policyURI });
      })
      .catch((err) => {
        console.log(err);
        errorToast(`Upload failed: ${err?.message}`);
      })
      .finally(() => setIsPolicyUploading(false));
  };

  return (
    <div className={cn(BASE_CONTAINER_STYLE, BASE_CONTAINER_LANDSCAPE_WIDTH_CALC)}>
      <Header text="Submit the List Policy File" />
      <label className="w-full">
        Fundamental to any list, the List Policy provides users with a set of rules that define what is allowed, and
        what isn’t allowed to be included in the list. Make sure to write it clearly, avoiding double interpretations.
        <br />
        <Link
          to={`/attachment/?url=${getIpfsUrl(
            "/ipfs/QmVcsLZYoXhzeM7S828aMK8Wh3VyUiSaKUG4YFYR2KjLyD/auditors-acceptance-policy-v1.pdf"
          )}`}
        >
          Check a Policy example
        </Link>{" "}
        .
      </label>
      <FileUploader
        className={cn("w-full", "[&_small]:whitespace-pre-line [&_small]:text-start", FILE_UPLOADER_MARGIN_BOTTOM_CALC)}
        callback={handleFileUpload}
        variant={isDesktop ? "info" : undefined}
        msg={"You can add the List Policy file." + (getFileUploaderMsg(Roles.Policy, roleRestrictions) ?? "")}
      />

      <NavigationButtons prevRoute="/submit-list/logo" nextRoute="/submit-list/deposit" />
    </div>
  );
};
export default Policy;
