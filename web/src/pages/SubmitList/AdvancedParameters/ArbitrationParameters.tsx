import { AlertMessage, DisplaySmall, DropdownCascader } from "@kleros/ui-components-library";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import LabeledInput from "components/LabeledInput";
import { landscapeStyle } from "styles/landscapeStyle";
import { rootCourtToItems, useCourtTree } from "hooks/queries/useCourtTree";
import { isUndefined } from "utils/index";
import Skeleton from "react-loading-skeleton";
import ETH from "svgs/icons/eth.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: max-content;
  ${landscapeStyle(
    () => css`
      min-height: 255px;
    `
  )}
`;
const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  ${landscapeStyle(
    () => css`
      grid-template-columns: 1fr 1fr;
    `
  )}
`;

const MiddleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  ${landscapeStyle(
    () => css`
      grid-template-columns: 1fr 1fr 1fr;
      align-items: end;
    `
  )}
`;
const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  div > button {
    width: 100%;
  }
`;

const AlertMessageContainer = styled.div`
  svg {
    flex-shrink: 0;
  }
`;

const StyledDisplay = styled(DisplaySmall)`
  width: 100%;
`;
const AbritrationParameters: React.FC = () => {
  const { data } = useCourtTree();
  const items = useMemo(() => !isUndefined(data) && [rootCourtToItems(data.court)], [data]);

  const handleWrite = (courtId: string) => {};

  return (
    <Container>
      <TopContainer>
        <LabeledInput topLeftLabel="Arbitrator" topRightLabel="Select Kleros" placeholder="100" />
        <LabeledInput topLeftLabel="Governor" topRightLabel="Select Kleros Governor" placeholder="100" />
      </TopContainer>

      <MiddleContainer>
        {items ? (
          <DropdownContainer>
            <label>Select a court</label>
            <DropdownCascader
              items={items}
              onSelect={(path: string | number) => typeof path === "string" && handleWrite(path.split("/").pop()!)}
              placeholder="Select Court"
            />
          </DropdownContainer>
        ) : (
          <Skeleton width={240} height={42} />
        )}
        <LabeledInput topLeftLabel="Select the number of jurors" placeholder="3" />
        <StyledDisplay text={"0.001"} Icon={ETH} label="Arbitration Cost" />
      </MiddleContainer>

      <AlertMessageContainer>
        <AlertMessage
          variant="info"
          title="Check the courts available beforehand."
          msg="Select a court to arbitrate disputes on this list. Kleros has different courts arbitrating disputes in several areas. Each court has its own purpose and policy. Take some time to choose the best court for your list."
        />
      </AlertMessageContainer>
    </Container>
  );
};

export default AbritrationParameters;
