import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { FileUploader, Textarea } from "@kleros/ui-components-library";
import LabeledInput from "components/LabeledInput";
import { responsiveSize } from "styles/responsiveSize";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 38px;
  margin: 6px 0px;
`;

const TitleField = styled(LabeledInput)`
  width: 100%;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DescriptionField = styled(Textarea)`
  width: 100%;
  height: 180px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
`;

const StyledFileUploader = styled(FileUploader)`
  width: 100%;
  margin-bottom: ${responsiveSize(52, 32)};
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

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
  const { uploadFile } = useAtlasProvider();
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
    <Container>
      <TitleField
        topLeftLabel={{ text: "Title" }}
        placeholder="eg. The item is not legit."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <DescriptionContainer>
        <StyledLabel>Description</StyledLabel>
        <DescriptionField
          placeholder="Explain what motivates you to challenge it. Why do you think the item is not compliant with the Policy?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </DescriptionContainer>
      <StyledFileUploader
        callback={handleFileUpload}
        variant="info"
        msg="Additionally, you can add an external file in PDF."
      />
    </Container>
  );
};

export default EvidenceUpload;
