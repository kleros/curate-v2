import React, { useEffect, useState } from "react";

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
      <h1 className="text-(length:--spacing-fluid-20-24) font-medium mb-12 tracking-[1px]">
        Community Curated <span className="text-klerosUIComponentsSecondaryPurple">{words[currentWordIndex]}</span>
      </h1>
    </div>
  );
};

export default Header;
