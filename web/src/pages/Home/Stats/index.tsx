import React, { useMemo } from "react";
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
import clsx from "clsx";

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
    <Card
      className={clsx(
        "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-8",
        "w-full h-fit mb-16 pb-4! lg:gap-0 lg:pb-0!"
      )}
      style={{
        padding: responsiveSize(16, 30),
        paddingLeft: responsiveSize(16, 54),
      }}
    >
      {stats.map(({ title, coinId, text, subtext, color, icon }, i) => {
        return <StatDisplay key={i} {...{ title, color, icon, text, subtext }} />;
      })}
    </Card>
  );
};

export default Stats;
