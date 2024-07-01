import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { getIpfsUrl } from "utils/getIpfsUrl";
import AttachmentIcon from "svgs/icons/attachment.svg";
import { customScrollbar } from "styles/customScrollbar";
import { Evidence } from "src/graphql/graphql";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const JustificationTitle = styled.h3`
  margin: 0px;
  font-weight: 600;
`;

const DescriptionContainer = styled.div`
  max-height: 400px;
  width: 100%;
  overflow-y: scroll;
  ${customScrollbar}
`;

const StyledA = styled.a`
  display: flex;
  gap: 6px;
  > svg {
    width: 16px;
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

export type Justification = Pick<Evidence, "name" | "description" | "evidence" | "fileURI">;

const JustificationDetails: React.FC<{ justification: Justification }> = ({ justification }) => {
  return (
    <Container>
      <JustificationTitle>{justification.name ?? "Unable to determine title"}</JustificationTitle>
      <DescriptionContainer>
        <ReactMarkdown>{justification.description ?? "Unable to determine description"}</ReactMarkdown>
      </DescriptionContainer>
      {justification?.fileURI && (
        <StyledA href={getIpfsUrl(justification.fileURI)}>
          <AttachmentIcon />
          View attached file
        </StyledA>
      )}
    </Container>
  );
};

export default JustificationDetails;
