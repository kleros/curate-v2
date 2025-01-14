import React from "react";
import styled, { css } from "styled-components";

import { Route, Routes } from "react-router-dom";

import { responsiveSize } from "styles/responsiveSize";

import EmailConfirmation from "./EmailConfirmation";
import { MAX_WIDTH_LANDSCAPE, landscapeStyle } from "styles/landscapeStyle";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: 32px 16px 40px;
  max-width: ${MAX_WIDTH_LANDSCAPE};
  margin: 0 auto;

  ${landscapeStyle(
    () => css`
      padding: 48px ${responsiveSize(0, 132)} 60px;
    `
  )}
`;

const Settings: React.FC = () => {
  return (
    <Container>
      <Routes>
        <Route path="email-confirmation" element={<EmailConfirmation />} />
      </Routes>
    </Container>
  );
};

export default Settings;
