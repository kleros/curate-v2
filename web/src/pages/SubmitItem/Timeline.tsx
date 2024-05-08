import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useLocation } from "react-router-dom";
import { Steps } from "@kleros/ui-components-library";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";

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

const Timeline: React.FC = () => {
  const location = useLocation();
  const { fieldProps } = useRegistryDetailsContext();
  const fieldItems = useMemo(
    () =>
      fieldProps
        ? fieldProps.reduce<string[]>((acc, current) => {
            acc.push(current.label);
            return acc;
          }, [])
        : [],
    [fieldProps]
  );

  const items = [{ title: "Item Details", subitems: fieldItems }, { title: "Policy Review" }, { title: "Preview" }];

  const routeToIndexMap = {
    "/submit-item/item-field": 0,
    "/policy": 1,
    "/preview": 2,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <StyledSteps {...{ items, currentItemIndex }} />;
};

export default Timeline;
