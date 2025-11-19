import React from "react";

interface ITitle {
  text: string;
}

const Title: React.FC<ITitle> = ({ text }) => {
  return <h1 className="mb-8 text-center w-[84vw] lg:w-auto">{text}</h1>;
};
export default Title;
