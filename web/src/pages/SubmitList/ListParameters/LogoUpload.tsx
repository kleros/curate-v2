import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { FileUploader } from "@kleros/ui-components-library";
import Header from "../Header";

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

const StyledFileUploader = styled(FileUploader)`
  width: 100%;
  margin-bottom: ${responsiveSize(52, 32)};
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const LogoUpload: React.FC = () => {
  const handleFileUpload = (file: File) => {};

  return (
    <Container>
      <Header text="Logo" />
      <StyledFileUploader
        callback={handleFileUpload}
        variant="info"
        msg="Upload a logo to represent your list. The logo should be a 1:1 aspect ratio image with transparent background, in SVG, or PNG."
      />

      <NavigationButtons prevRoute="/submitList/description" nextRoute="/submitList/policy" />
    </Container>
  );
};
export default LogoUpload;
