import { AlertMessage, DropdownCascader } from "@kleros/ui-components-library";
import React, { useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import LabeledInput from "components/LabeledInput";
import { landscapeStyle } from "styles/landscapeStyle";
import { rootCourtToItems, useCourtTree } from "hooks/queries/useCourtTree";
import { isUndefined } from "utils/index";
import Skeleton from "react-loading-skeleton";
import ETH from "svgs/icons/eth-round.svg";
import LightButton from "components/LightButton";
import { useSubmitListContext } from "context/SubmitListContext";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { prepareArbitratorExtradata } from "utils/prepareArbitratorExtradata";
import { formatEther, isAddress } from "viem";
import { KLEROS_GOVERNOR } from "consts/arbitration";

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
  display: flex;
  width: 100%;
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

const StyledButton = styled(LightButton)`
  border: none;
  padding: 0px;
  .button-text {
    color: ${({ theme }) => theme.primaryBlue};
    font-size: 14px;
    line-height: 18px;
  }
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
`;
const AbritrationParameters: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();
  const { data } = useCourtTree();
  const items = useMemo(() => !isUndefined(data) && [rootCourtToItems(data.court)], [data]);

  const isGovernorValid = useMemo(() => listData.governor === "" || isAddress(listData.governor), [listData.governor]);

  const { arbitrationCost } = useArbitrationCost(
    prepareArbitratorExtradata(listData.courtId ?? "1", listData.numberOfJurors)
  );

  useEffect(
    () => setListData({ ...listData, arbitrationCost: formatEther((arbitrationCost as bigint) ?? "") }),
    [arbitrationCost]
  );

  const handleCourtWrite = (courtId: string) => {
    setListData({ ...listData, courtId });
  };

  const handleJurorsWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListData({ ...listData, numberOfJurors: parseInt(event.target.value.replace(/\D/g, ""), 10) });
  };

  const noOfVotes = Number.isNaN(listData.numberOfJurors) ? "" : listData.numberOfJurors;
  return (
    <Container>
      <TopContainer>
        <LabeledInput
          topLeftLabel={{ text: "Governor" }}
          topRightLabel={{
            text: (
              <StyledButton
                text="Select Kleros Governor"
                onClick={() => setListData({ ...listData, governor: KLEROS_GOVERNOR })}
              />
            ),
          }}
          placeholder="Governor address"
          value={listData.governor}
          onChange={(event) => setListData({ ...listData, governor: event.target.value as `0x${string}` })}
          variant={isGovernorValid ? "" : "error"}
          message={!isGovernorValid ? "Invalid Address" : ""}
        />
      </TopContainer>

      <MiddleContainer>
        {items ? (
          <DropdownContainer>
            <StyledLabel>Select a court</StyledLabel>
            <DropdownCascader
              items={items}
              onSelect={(path: string | number) => typeof path === "string" && handleCourtWrite(path.split("/").pop()!)}
              placeholder="Select Court"
            />
          </DropdownContainer>
        ) : (
          <Skeleton width={240} height={42} />
        )}
        <LabeledInput
          topLeftLabel={{ text: "Select the number of jurors" }}
          placeholder="Number of Jurors"
          value={noOfVotes}
          onChange={handleJurorsWrite}
        />
        <LabeledInput
          value={formatEther((arbitrationCost as bigint) ?? "")}
          Icon={ETH}
          topLeftLabel={{ text: "Arbitration Cost" }}
          disabled
        />
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
