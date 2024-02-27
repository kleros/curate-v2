import { Card, CustomTimeline, _TimelineItem1 as TimelineItem } from "@kleros/ui-components-library";
import React from "react";
import styled from "styled-components";
import Header from "./Header";

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

interface IHistory {
  items: TimelineItem[];
}

const History: React.FC<IHistory> = ({ items }) => {
  return (
    <Container>
      <Header />
      <StyledTimeline {...{ items }} />
    </Container>
  );
};
export default History;
