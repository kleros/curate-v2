import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { FileUploader } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { toast } from "react-toastify";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";
import { SUPPORTED_FILE_TYPES } from "src/consts";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { Link } from "react-router-dom";

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

const StyledLabel = styled.label`
  width: 100%;
`;

const StyledFileUploader = styled(FileUploader)`
  width: 100%;
  margin-bottom: ${responsiveSize(52, 32)};
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const Policy: React.FC = () => {
  const { listMetadata, setListMetadata, setIsPolicyUploading } = useSubmitListContext();

  const handleFileUpload = (file: File) => {
    if (!SUPPORTED_FILE_TYPES.includes(file?.type)) {
      toast.error("File type not supported", toastOptions);
      return;
    }
    setIsPolicyUploading(true);

    uploadFileToIPFS(file)
      .then(async (res) => {
        const response = await res.json();
        const policyURI = response["cids"][0];
        setListMetadata({ ...listMetadata, policyURI });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsPolicyUploading(false));
  };

  return (
    <Container>
      <Header text="Submit the List Policy File" />
      <StyledLabel>
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
      </StyledLabel>
      <StyledFileUploader callback={handleFileUpload} variant="info" msg="You can add the List Policy file in PDF." />

      <NavigationButtons prevRoute="/submit-list/logo" nextRoute="/submit-list/deposit" />
    </Container>
  );
};
export default Policy;
