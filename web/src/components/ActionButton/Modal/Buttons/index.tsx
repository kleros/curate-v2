import React from "react";
import { Button } from "@kleros/ui-components-library";
import { EnsureChain } from "components/EnsureChain";
import EnsureAuth from "components/EnsureAuth";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import { ErrorButtonMessage } from "./ErrorButtonMessage";

interface IButtons {
  toggleModal: () => void;
  callback: () => void;
  buttonText: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  insufficientBalance: boolean;
}

const Buttons: React.FC<IButtons> = ({
  toggleModal,
  buttonText,
  callback,
  isLoading,
  isDisabled,
  insufficientBalance,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-between w-full">
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <EnsureChain>
        <EnsureAuth>
          <div className="flex flex-col items-center">
            <Button
              text={buttonText}
              onClick={() => {
                callback();
              }}
              isLoading={isLoading}
              isDisabled={isDisabled}
            />
            {insufficientBalance ? (
              <ErrorButtonMessage>
                <ClosedCircleIcon /> Insufficient balance
              </ErrorButtonMessage>
            ) : null}
          </div>
        </EnsureAuth>
      </EnsureChain>
    </div>
  );
};
export default Buttons;
