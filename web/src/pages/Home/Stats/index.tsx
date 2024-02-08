import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Card } from "@kleros/ui-components-library";
import StatDisplay, { IColors } from "components/StatDisplay";
import PaperIcon from "svgs/icons/paper.svg";
import ListIcon from "svgs/icons/list.svg";
import DollarIcon from "svgs/icons/dollar.svg";
import JurorIcon from "svgs/icons/user.svg";
import { responsiveSize } from "styles/responsiveSize";

const StyledCard = styled(Card)`
  width: 100%;
  height: fit-content;
  gap: 32px;
  padding: ${responsiveSize(16, 30)};
  padding-left: ${responsiveSize(16, 54)};
  padding-bottom: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  margin-bottom: 64px;

  ${landscapeStyle(
    () => css`
      padding-bottom: 0px;
      gap: 0px;
    `
  )}
`;

interface IStat {
  title: string;
  coinId?: number;
  text: string;
  subtext: string;
  color: IColors;
  icon: React.FC<React.SVGAttributes<SVGElement>>;
}

const stats: IStat[] = [
  {
    title: "Total",
    coinId: 0,
    text: "25 Lists",
    subtext: "in 3 Networks",
    color: "purple",
    icon: PaperIcon,
  },
  {
    title: "Total",
    coinId: 1,
    text: "345 Items",
    subtext: "Curated",
    color: "blue",
    icon: ListIcon,
  },
  {
    title: "All time deposits",
    coinId: 0,
    text: "$124,000",
    subtext: "100 ETH",
    color: "green",
    icon: DollarIcon,
  },
  {
    title: "Curators",
    text: "54",
    subtext: "36 active",
    color: "orange",
    icon: JurorIcon,
  },
];

const Stats = () => {
  return (
    <StyledCard>
      {stats.map(({ title, coinId, text, subtext, color, icon }, i) => {
        return <StatDisplay key={i} {...{ title, color, icon, text, subtext }} />;
      })}
    </StyledCard>
  );
};

export default Stats;
