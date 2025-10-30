import React, { useRef } from "react";

import { useClickAway } from "react-use";

import Guide from "svgs/icons/book.svg";
import Bug from "svgs/icons/bug.svg";
import ETH from "svgs/icons/eth.svg";
import Faq from "svgs/menu-icons/help.svg";
import Telegram from "svgs/socialmedia/telegram.svg";

import Debug from "../Debug";
import { IHelp } from "../index";

const ITEMS = [
  {
    text: "Get Help",
    Icon: Telegram,
    url: "https://t.me/kleros",
  },
  {
    text: "Report a Bug",
    Icon: Bug,
    url: "https://github.com/kleros/curate-v2/issues",
  },
  {
    text: "DApp Guide",
    Icon: Guide,
    url: "https://docs.kleros.io/products/curate",
  },
  {
    text: "Crypto Beginner's Guide",
    Icon: ETH,
    url: "https://ethereum.org/en/wallets/",
  },
  {
    text: "FAQ",
    Icon: Faq,
    url: "https://docs.kleros.io/kleros-faq",
  },
];

const Help: React.FC<IHelp> = ({ toggleIsHelpOpen }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleIsHelpOpen());

  return (
    <>
      <div
        ref={containerRef}
        className={
          "flex flex-col absolute max-h-[80vh] overflow-y-auto width-[86vw] max-width-[444px] top-[5%] left-1/2 transform -translate-x-1/2 z-1 p-3 pb-6 border border-klerosUIComponentsStroke rounded-[3px] bg-klerosUIComponentsWhiteBackground shadow-[0px_2px_3px_rgba(0,0,0,0.06)]" +
          "landscape-900:mt-16 landscape-900:top-0 landscape-900:right-0 landscape-900:left-auto landscape-900:transform-none landscape-900:max-w-[260px]"
        }
      >
        {ITEMS.map((item, index) => (
          <a
            href={item.url}
            key={item.text}
            target="_blank"
            className="flex gap-2 py-3 px-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          >
            <item.Icon className="inline-block w-4 h-4 fill-klerosUIComponentsSecondaryPurple" />
            <small className="text-base font-normal hover:transition-colors hover:duration-100 hover:text-klerosUIComponentsSecondaryPurple">
              {item.text}
            </small>
          </a>
        ))}
        <Debug />
      </div>
    </>
  );
};
export default Help;
