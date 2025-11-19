import React from "react";

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <h1 className="text-center m-0 w-[84vw] lg:w-auto">{text}</h1>;
};
export default Header;
