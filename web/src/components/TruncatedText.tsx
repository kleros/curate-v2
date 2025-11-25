import React from "react";
import { cn } from "src/utils";

interface ITruncatedText {
  text: string;
  maxLength: number;
  className?: string;
}

/**
 *
 * @param text text to be truncated
 * @returns A Truncated text element
 */
const TruncatedText: React.FC<ITruncatedText> = ({ text, maxLength, className }) => {
  const truncatedText = text?.length <= maxLength ? text : text?.slice(0, maxLength) + "…";
  return <div className={cn("text-klerosUIComponentsPrimaryText font-normal m-0", className)}>{truncatedText}</div>;
};

export default TruncatedText;
