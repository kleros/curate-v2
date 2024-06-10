import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FileUploader, Textarea } from "@kleros/ui-components-library";
import LabeledInput from "components/LabeledInput";
import { responsiveSize } from "styles/responsiveSize";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";
import { SUPPORTED_FILE_TYPES } from "src/consts";

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

  useEffect(() => {
    setEvidence({
      name: title,
      description,
      fileURI,
      fileTypeExtension: "pdf",
    });
  }, [title, description, fileURI]);

  const handleFileUpload = (file: File) => {
    if (!SUPPORTED_FILE_TYPES.includes(file?.type)) {
      toast.error("File type not supported", toastOptions);
      return;
    }
    setIsEvidenceUploading(true);
    uploadFileToIPFS(file)
      .then(async (res) => {
        const response = await res.json();
        const fileURI = response["cids"][0];
        setFileURI(fileURI);
      })
      .catch((err) => console.log(err))
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
