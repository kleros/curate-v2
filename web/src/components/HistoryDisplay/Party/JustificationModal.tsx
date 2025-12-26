import React from "react";
import { Button } from "@kleros/ui-components-library";

import Modal from "components/Modal";
import ActionButton from "components/ActionButton";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

import { RequestDetailsFragment } from "src/graphql/graphql";

import Header from "./Header";
import JustificationDetails from "./JustificationDetails";
import clsx from "clsx";
import { Evidence } from "src/types/Evidence";

interface IJustificationModal {
  request: RequestDetailsFragment;
  isRemoval: boolean;
  justification?: Evidence;
  toggleModal: () => void;
}

const JustificationModal: React.FC<IJustificationModal> = ({ request, toggleModal, isRemoval, justification }) => {
  return (
    <Modal className="gap-8" {...{ toggleModal }}>
      <Header text={isRemoval ? "Removal Requested" : "Request Challenged"} />
      <h3 className={clsx("w-full mb-1", "text-center text-base text-klerosUIComponentsPrimaryText font-semibold")}>
        Justification
      </h3>
      {justification ? (
        <JustificationDetails {...{ justification }} />
      ) : (
        <label className="w-full">No Justification provided</label>
      )}
      <div className="flex flex-wrap justify-between w-full mt-9 gap-y-2">
        <Button variant="secondary" text="Return" onPress={toggleModal} />
        {!request.resolved && (
          <ActionButton
            isItem
            itemId={request.item.itemID}
            status={mapFromSubgraphStatus(request.item.status, request.disputed)}
            registryAddress={request.item.registryAddress}
          />
        )}
      </div>
    </Modal>
  );
};

export default JustificationModal;
