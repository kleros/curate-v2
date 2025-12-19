import React, { useEffect } from "react";
import { Card } from "@kleros/ui-components-library";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { formatUnitsWei, formatValue } from "utils/format";

import { useReadCurateV2GetArbitratorExtraData, useReadCurateV2SubmissionBaseDeposit } from "hooks/useContract";
import { isUndefined } from "src/utils";
import { useReadKlerosCoreArbitrationCost } from "hooks/contracts/generated";
import clsx from "clsx";

interface IHeader {}

const Header: React.FC<IHeader> = ({}) => {
  const { title } = useRegistryDetailsContext();
  const { submissionDeposit, setSubmissionDeposit } = useSubmitItemContext();
  const { id } = useParams();
  const [listAddress, _]: string[] = id?.split("-");

  const { data: deposit } = useReadCurateV2SubmissionBaseDeposit({ address: listAddress as `0x${string}` });

  const { data: arbitratorExtraData } = useReadCurateV2GetArbitratorExtraData({
    address: listAddress as `0x${string}`,
  });

  const { data: arbitrationCost } = useReadKlerosCoreArbitrationCost({
    query: {
      enabled: !isUndefined(arbitratorExtraData),
    },
    args: [arbitratorExtraData!],
  });

  useEffect(() => {
    if (isUndefined(deposit) || isUndefined(arbitrationCost)) return;
    setSubmissionDeposit(((arbitrationCost as bigint) + deposit).toString());
  }, [deposit, arbitrationCost]);

  return (
    <div className="flex justify-center">
      <Card
        className={clsx(
          "flex flex-wrap justify-between gap-6",
          "h-auto w-[80vw] lg:w-[91vw]",
          "mb-9 mt-[60px] py-6 px-fluid-24-32"
        )}
      >
        <div className="flex flex-wrap gap-2">
          <p className="text-2xl font-semibold">Submit Item to</p>
          {title ? (
            <p className="text-2xl font-semibold text-klerosUIComponentsSecondaryPurple">{title}</p>
          ) : (
            <Skeleton width={100} height={26} />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-y-4 gap-x-12">
          <div className="flex flex-wrap">
            <PileCoinsIcon width={16} className="mr-2 fill-klerosUIComponentsSecondaryPurple" />
            <p>Deposit required:&nbsp;</p>
            {submissionDeposit ? (
              <p>{formatValue(formatUnitsWei(BigInt(submissionDeposit)), 5, false)} ETH</p>
            ) : (
              <Skeleton width={60} height={24} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Header;
