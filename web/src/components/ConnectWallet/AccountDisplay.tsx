import React from "react";

import Identicon from "react-identicons";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useAccount, useChainId, useEnsAvatar, useEnsName } from "wagmi";

import { getChain } from "consts/chains";
import { shortenAddress } from "utils/shortenAddress";

interface IIdenticonOrAvatar {
  size?: `${number}`;
  address?: `0x${string}`;
}

export const IdenticonOrAvatar: React.FC<IIdenticonOrAvatar> = ({ size = "16", address: propAddress }) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data: name } = useEnsName({
    address,
    chainId: 1,
  });
  const { data: avatar } = useEnsAvatar({
    name: normalize(name ?? ""),
    chainId: 1,
  });

  return avatar ? (
    <img className="items-center object-cover rounded-[50%]" src={avatar} alt="avatar" width={size} height={size} />
  ) : (
    <Identicon className="items-center" size={size} string={address} />
  );
};

interface IAddressOrName {
  address?: `0x${string}`;
}

export const AddressOrName: React.FC<IAddressOrName> = ({ address: propAddress }) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data } = useEnsName({
    address,
    chainId: 1,
  });

  return <label>{data ?? (isAddress(address!) ? shortenAddress(address) : address)}</label>;
};

export const ChainDisplay: React.FC = () => {
  const chainId = useChainId();
  const chain = getChain(chainId);
  return <label>{chain?.name}</label>;
};

const AccountDisplay: React.FC = () => {
  return (
    <div
      className={
        "flex flex-col justify-between h-auto items-center gap-2 bg-klerosUIComponentsWhiteBackground p-0 cursor-pointer" +
        "hover:[&_label]:text-white hover:[&_label]:transition-colors hover:[&_label]:duration-200 landscape-900:hover:bg-white-low-opacity-strong landscape-900:hover:transition-[background-color_0.1s]" +
        "landscape-900:bg-white-low-opacity-subtle landscape-900:flex-row landscape-900:content-center landscape-900:rounded-[300px] landscape-900:gap-0 landscape-900:py-0 landscape-900:px-3"
      }
    >
      <div
        className={
          "flex items-center gap-2 w-fit min-h-8 [&>label]:text-base [&>label]:font-semibold" +
          "landscape-900:gap-3 landscape-900:[&>label]:text-sm landscape-900:[&>label]:font-normal"
        }
      >
        <IdenticonOrAvatar size="32" />
        <AddressOrName />
      </div>
      <div
        className={
          "flex w-fit min-h-8 items-center pl-0 [&>label]:text-klerosUIComponentsSuccess [&>label]:text-base [&>label]:font-medium" +
          "before:content-[''] before:w-2 before:h-2 before:rounded-[50%] before:bg-klerosUIComponentsSuccess before:my-0 before:mr-[13px] before:ml-[3px]" +
          "landscape-900:display-none"
        }
      >
        <ChainDisplay />
      </div>
    </div>
  );
};

export default AccountDisplay;
