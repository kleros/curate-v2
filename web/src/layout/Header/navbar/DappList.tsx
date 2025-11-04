import React, { useRef } from "react";

import { useClickAway } from "react-use";

import Curate from "svgs/icons/curate-image.png";
import Resolver from "svgs/icons/dispute-resolver.svg";
import Escrow from "svgs/icons/escrow.svg";
import Governor from "svgs/icons/governor.svg";
import Court from "svgs/icons/kleros.svg";
import POH from "svgs/icons/poh-image.png";
import Vea from "svgs/icons/vea.svg";

import { responsiveSize } from "styles/responsiveSize";

import Product from "./Product";

const ITEMS = [
  {
    text: "Court V2",
    Icon: Court,
    url: "https://v2.kleros.builders/",
  },
  {
    text: "Curate V2",
    Icon: Curate,
    url: "https://curate-v2.netlify.app/",
  },
  {
    text: "Resolver V2",
    Icon: Resolver,
    url: "https://v2.kleros.builders/#/resolver",
  },
  {
    text: "Escrow V2",
    Icon: Escrow,
    url: "https://escrow-v2.kleros.builders/",
  },
  {
    text: "Court V1",
    Icon: Court,
    url: "https://court.kleros.io/",
  },
  {
    text: "Curate V1",
    Icon: Curate,
    url: "https://curate.kleros.io",
  },
  {
    text: "Resolver V1",
    Icon: Resolver,
    url: "https://resolve.kleros.io",
  },
  {
    text: "Escrow V1",
    Icon: Escrow,
    url: "https://escrow.kleros.io",
  },
  {
    text: "Vea",
    Icon: Vea,
    url: "https://veascan.io",
  },
  {
    text: "Kleros Scout",
    Icon: Curate,
    url: "https://klerosscout.eth.limo",
  },
  {
    text: "POH V2",
    Icon: POH,
    url: "https://v2.proofofhumanity.id",
  },
  {
    text: "Governor",
    Icon: Governor,
    url: "https://governor.kleros.io",
  },
];

interface IDappList {
  toggleIsDappListOpen: () => void;
}

const DappList: React.FC<IDappList> = ({ toggleIsDappListOpen }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleIsDappListOpen());

  return (
    <div
      ref={containerRef}
      className={
        "flex flex-col items-center absolute max-h-[340px] top-[5%] left-1/2 transform -translate-x-1/2 z-1 w-[86vw] max-w-[480px] border border-klerosUIComponentsStroke rounded-[3px] bg-klerosUIComponentsWhiteBackground shadow-[0px_2px_3px_rgba(0,0,0,0.06)] " +
        "[&_svg]:visible lg:mt-16 lg:top-0 lg:left-0 lg:right-auto lg:transform-none lg:max-h-[80vh]"
      }
      style={{ width: responsiveSize(300, 480, 900) }}
    >
      <h1 className="pt-6 text-2xl font-semibold leading-8">Kleros Solutions</h1>
      <div
        className="grid overflow-y-auto gap-y-2 gap-x-0.5 justify-items-center max-w-[480px] min-w-[300px] grid-cols-[repeat(auto-fit,minmax(100px,1fr))]"
        style={{ padding: `4px ${responsiveSize(8, 24)} 16px`, width: responsiveSize(300, 480) }}
      >
        {ITEMS.map((item) => {
          return <Product {...item} key={item.text} />;
        })}
      </div>
    </div>
  );
};
export default DappList;
