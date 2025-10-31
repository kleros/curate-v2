import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOpenContext } from "../MobileHeader";
import { MAIN_CURATE_ADDRESS } from "consts/index";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { isUndefined } from "utils/index";
import { getIpfsUrl } from "utils/getIpfsUrl";

interface IExplore {
  isMobileNavbar?: boolean;
}

const Explore: React.FC<IExplore> = ({ isMobileNavbar }) => {
  const location = useLocation();
  const { toggleIsOpen } = useOpenContext();
  const { data: mainCurate } = useRegistryDetailsQuery(MAIN_CURATE_ADDRESS);
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.split("/")[1] === to.split("/")[1];

  const links = useMemo(
    () => [
      { identifier: "/", to: "/", text: "Home" },
      {
        identifier: "/attachment/",
        to: isUndefined(mainCurate) ? "/" : `/attachment/?url=${getIpfsUrl(mainCurate.registry.policyURI ?? "")}`,
        text: "Curation Policy",
      },
    ],
    [mainCurate]
  );

  return (
    <div className="flex flex-col landscape-900:flex-row">
      <h1 className="block mb-2 landscape-900:hidden">Explore</h1>
      {links.map(({ to, text, identifier }) => (
        <Link
          key={text}
          className={
            "flex items-center no-underline text-base p-2 pl-0 rounded-[7px] landscape-900:py-4 landscape-900:px-2 " +
            `${
              isActive(to)
                ? "text-klerosUIComponentsPrimaryText landscape-900:text-white "
                : "text-primary-text-73 landscape-900:text-white-73 "
            }` +
            `${isMobileNavbar && isActive(to) ? "font-semibold " : "font-normal "}` +
            `hover:${isMobileNavbar ? "text-klerosUIComponentsPrimaryText" : "text-white"}`
          }
          onClick={toggleIsOpen}
          {...{ to }}
        >
          {text}
        </Link>
      ))}
    </div>
  );
};

export default Explore;
