import React, { useRef } from "react";
import { Overlay } from "./Overlay";
import { useClickAway } from "react-use";
import { cn } from "src/utils";

const Modal: React.FC<{ children: React.ReactNode; toggleModal: () => void; className?: string }> = ({
  children,
  toggleModal,
  className,
}) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());
  return (
    <Overlay>
      <div
        className={cn(
          "flex flex-col items-center bg-klerosUIComponentsWhiteBackground",
          "fixed top-[10vh] left-1/2 overflow-y-auto z-10",
          "w-[86vw] max-w-[600px] max-h-[80vh] py-8 pr-8 pl-9",
          "transform -translate-x-1/2",
          "border rounded-[3px] border-klerosUIComponentsStroke",
          "shadow-default",
          className
        )}
        ref={containerRef}
      >
        {children}
      </div>
    </Overlay>
  );
};

export default Modal;
