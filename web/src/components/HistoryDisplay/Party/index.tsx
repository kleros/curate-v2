import React from "react";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { RequestDetailsFragment } from "src/graphql/graphql";
import DocIcon from "svgs/icons/doc.svg";
import { useToggle } from "react-use";
import JustificationModal from "./JustificationModal";

interface IParty {
  request: RequestDetailsFragment;
  isRemoval?: boolean;
}

const Party: React.FC<IParty> = ({ request, isRemoval = false }) => {
  const [isOpen, toggleModal] = useToggle(false);
  const aliasAddress = isRemoval ? request.requester.id : request?.challenger?.id;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <label>by</label>
      <AliasDisplay className="leading-18px" address={aliasAddress ?? ""} />
      <label>-</label>
      <label
        className="flex items-center gap-1 cursor-pointer text-klerosUIComponentsPrimaryBlue"
        onClick={toggleModal}
      >
        <DocIcon width={16} height={16} className="fill-klerosUIComponentsPrimaryBlue" /> Justification
      </label>
      {isOpen && <JustificationModal {...{ request, toggleModal, isRemoval }} />}
    </div>
  );
};

export default Party;
