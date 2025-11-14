import React from "react";
import WithHelpTooltip from "components/WithHelpTooltip";
import TruncatedText from "components/TruncatedText";
import { Overlay } from "components/Overlay";
import { TextArea } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import Modal from "components/Modal";

const LongTextFullDisplay: React.FC<{ text: string; toggleModal: () => void }> = ({ text, toggleModal }) => (
  <Overlay>
    <Modal className="p-0" {...{ toggleModal }}>
      <TextArea className="w-full h-[80vh]" value={text} isDisabled />
    </Modal>
  </Overlay>
);

export interface ILongTextField {
  value: string;
  detailed?: boolean;
  label?: string;
}

const LongTextField: React.FC<ILongTextField> = ({ value, detailed, label }) => {
  const [isModalOpen, toggleModal] = useToggle(false);
  return (
    <>
      <p className="m-0">
        {detailed ? (
          <WithHelpTooltip tooltipMsg={label ?? ""}>
            <TruncatedText text={value} maxLength={40} />
            &nbsp;{" "}
            <label className="cursor-pointer text-klerosUIComponentsPrimaryBlue" onClick={toggleModal}>
              [Read More]
            </label>
          </WithHelpTooltip>
        ) : (
          <TruncatedText text={value} maxLength={30} />
        )}
      </p>
      {isModalOpen && <LongTextFullDisplay text={value} toggleModal={toggleModal} />}
    </>
  );
};

export default LongTextField;
