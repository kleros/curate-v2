import React from "react";
import Ellipse from "assets/svgs/icons/ellipse.svg";
import Plus from "assets/svgs/icons/plus.svg";
import Minus from "assets/svgs/icons/minus.svg";
import { cn } from "src/utils";

const iconContainerStyle = "relative p-0 rounded-[50%] border-none bg-transparent cursor-pointer";
const iconStyle = "absolute fill-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

interface IPlusMinusField {
  currentValue: number;
  updateValue: (currentValue: number) => void;
  minValue?: number;
  className?: string;
}
const PlusMinusField: React.FC<IPlusMinusField> = ({ currentValue, updateValue, minValue = 0, className }) => {
  const incrementValue = () => updateValue(currentValue + 1);
  const decrementValue = () => currentValue > minValue && updateValue(currentValue - 1);

  return (
    <div className={cn("flex gap-2 mx-0 mt-8 mb-12", className)}>
      <button type="button" aria-label="Increment value" className={iconContainerStyle} onClick={incrementValue}>
        <Ellipse />
        <Plus className={iconStyle} />
      </button>
      <button type="button" aria-label="Decrement value" className={iconContainerStyle} onClick={decrementValue}>
        <Ellipse className={cn(currentValue === minValue && "[&_circle]:opacity-12")} />
        <Minus className={iconStyle} />
      </button>
    </div>
  );
};

export default PlusMinusField;
