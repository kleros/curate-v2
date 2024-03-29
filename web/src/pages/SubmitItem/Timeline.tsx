import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useLocation } from "react-router-dom";
import { Steps } from "@kleros/ui-components-library";

const StyledSteps = styled(Steps)`
  display: none;

  ${landscapeStyle(
    () => css`
      display: flex;
      position: absolute;
      left: 2%;
      height: 220px;
    `
  )}
`;

const items = [
  { title: "Item Details", subitems: ["item field 1", "item field 2", "item field 3"] },
  { title: "Policy Review" },
  { title: "Preview" },
];

const Timeline: React.FC = () => {
  const location = useLocation();

  const routeToIndexMap = {
    "/submitItem/itemField1": 0,
    "/submitItem/itemField2": 0,
    "/submitItem/itemField3": 0,
    "/submitItem/policy": 1,
    "/submitItem/preview": 2,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <StyledSteps {...{ items, currentItemIndex }} />;
};

export default Timeline;
