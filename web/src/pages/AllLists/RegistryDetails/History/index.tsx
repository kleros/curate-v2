import { Card, CustomTimeline } from "@kleros/ui-components-library";
import React from "react";
import styled, { useTheme } from "styled-components";
import Header from "./Header";
import ClosedIcon from "assets/svgs/icons/check-circle-outline.svg";

const Container = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: start;
  padding: 22px 32px;
  gap: 54px;
`;

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
  margin-bottom: 30px;
`;
interface IHistory {}

const History: React.FC<IHistory> = () => {
  const theme = useTheme();
  const items = [
    {
      title: "Item Submitted",
      variant: theme.primaryBlue,
      subtitle: "April 06, 2022",
      rightSided: true,
    },
    {
      title: "Item Challenged",
      party: "- Case #1369 by Alice.eth",
      variant: theme.secondaryPurple,
      subtitle: "April 07, 2022",
      rightSided: true,
    },
    {
      title: "Item Submitted",
      subtitle: "April 06, 2022",
      rightSided: true,
      Icon: ClosedIcon,
    },
  ];
  return (
    <Container>
      <Header />
      <StyledTimeline {...{ items }} />
    </Container>
  );
};
export default History;
