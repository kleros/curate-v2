import React from "react";
import clsx from "clsx";

import HeroImage from "components/HeroImage";
import Header from "./Header";
import Stats from "./Stats";
import HighlightedLists from "./Highlights";

const inlinePaddingCalc = "calc(0px+(132-0)*(min(max(100vw,375px),1250px)-375px)/(1250-375))";

const Home: React.FC = () => {
  return (
    <>
      <HeroImage />
      <div
        className={clsx(
          "w-full max-w-[1400px] mx-auto bg-klerosUIComponentsLightBackground px-4 pt-4 pb-10",
          `lg:px-[${inlinePaddingCalc}] lg:pb-[60px]`
        )}
      >
        <Header />
        <Stats />
        <HighlightedLists />
      </div>
    </>
  );
};

export default Home;
