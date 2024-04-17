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
    "/submit-list/title": 0,
    "/submit-list/description": 0,
    "/submit-list/logo": 0,
    "/submit-list/policy": 0,
    "/submit-list/deposit": 1,
    "/submit-list/fields": 1,
    "/submit-list/item-preview": 1,
    "/submit-list/custom": 1,
    "/submit-list/advanced": 2,
    "/submit-list/deploy": 3,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <StyledSteps {...{ items, currentItemIndex }} />;
};

export default Timeline;
