import React from "react";
import styled, { css } from "styled-components";
import { Steps } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import { useLocation } from "react-router-dom";

const StyledSteps = styled(Steps)`
  display: none;

  ${landscapeStyle(
    () => css`
      display: flex;
      position: absolute;
      left: 2%;
      height: 360px;
    `
  )}
`;

const items = [
  { title: "List", subitems: ["Name", "Description", "Logo", "Policy"] },
  { title: "Item", subitems: ["Deposit", "Fields", "Preview", "Custom"] },
  { title: "Advanced" },
  { title: "Deploy" },
];

const Timeline: React.FC = () => {
  const location = useLocation();

  const routeToIndexMap = {
    "/submitList/title": 0,
    "/submitList/description": 0,
    "/submitList/logo": 0,
    "/submitList/policy": 0,
    "/submitList/deposit": 1,
    "/submitList/fields": 1,
    "/submitList/itemPreview": 1,
    "/submitList/custom": 1,
    "/submitList/advanced": 2,
    "/submitList/deploy": 3,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <StyledSteps {...{ items, currentItemIndex }} />;
};

export default Timeline;
