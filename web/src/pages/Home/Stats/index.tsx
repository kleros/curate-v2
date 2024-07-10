import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Card } from "@kleros/ui-components-library";
import StatDisplay, { IColors } from "components/StatDisplay";
import PaperIcon from "svgs/icons/paper.svg";
import ListIcon from "svgs/icons/list.svg";
import DollarIcon from "svgs/icons/dollar.svg";
import JurorIcon from "svgs/icons/user.svg";
import { responsiveSize } from "styles/responsiveSize";
import { useCoinPrice } from "hooks/useCoinPrice";
import { CoinIds } from "consts/coingecko";
import { useCounter } from "hooks/queries/useCounter";
import { formatUSD, formatUnitsWei } from "utils/format";

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

const Stats = () => {
  const { data: counters } = useCounter();

  const coinIds = [CoinIds.PNK, CoinIds.ETH];
  const { prices: pricesData } = useCoinPrice(coinIds);

  const stats: IStat[] = useMemo(() => {
    const totalDeposits = BigInt(counters?.counter?.totalDeposits ?? 0);

    const ethDeposit = Number(formatUnitsWei(totalDeposits));

    return [
      {
        title: "Total",
        text: `${counters?.counter?.totalRegistries ?? 0} Lists`,
        subtext: "Curated",
        color: "purple",
        icon: PaperIcon,
      },
      {
        title: "Total",
        text: `${counters?.counter?.totalItems ?? 0} Items`,
        subtext: "Curated",
        color: "blue",
        icon: ListIcon,
      },
      {
        title: "All time deposits",
        text: `${
          ethDeposit && pricesData?.[CoinIds.ETH]?.price
            ? formatUSD(ethDeposit * pricesData?.[CoinIds.ETH]?.price)
            : "0$"
        }`,
        subtext: `${ethDeposit} ETH`,
        color: "green",
        icon: DollarIcon,
      },
      {
        title: "Curators",
        text: `${counters?.counter?.numberOfCurators ?? 0}`,
        subtext: "Active",
        color: "orange",
        icon: JurorIcon,
      },
    ];
  }, [counters, pricesData]);
  return (
    <StyledCard>
      {stats.map(({ title, coinId, text, subtext, color, icon }, i) => {
        return <StatDisplay key={i} {...{ title, color, icon, text, subtext }} />;
      })}
    </StyledCard>
  );
};

export default Stats;
