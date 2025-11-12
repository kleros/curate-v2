import React, { useEffect, useState } from "react";
import { responsiveSize } from "styles/responsiveSize";

const Header: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Lists", "Knowledge"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-between">
      <h1 className="font-medium mb-12 tracking-[1px]" style={{ fontSize: responsiveSize(21, 24) }}>
        Community Curated <span className="text-klerosUIComponentsSecondaryPurple">{words[currentWordIndex]}</span>
      </h1>
    </div>
  );
};

export default Header;
