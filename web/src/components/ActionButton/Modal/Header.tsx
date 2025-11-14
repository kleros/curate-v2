import React from "react";

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <h1 className="m-0">{text}</h1>;
};

export default Header;
