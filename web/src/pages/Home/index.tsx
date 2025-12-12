import React from "react";
import clsx from "clsx";

import HeroImage from "components/HeroImage";
import Header from "./Header";
import Stats from "./Stats";
import HighlightedLists from "./Highlights";

const Home: React.FC = () => {
  return (
    <>
      <HeroImage />
      <div
        className={clsx(
          "w-full max-w-landscape mx-auto bg-klerosUIComponentsLightBackground px-4 pt-4 pb-10",
          `lg:px-fluid-0-32 lg:pb-[60px]`
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
