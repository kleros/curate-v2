import React, { useEffect, useState } from "react";
import { Button } from "@kleros/ui-components-library";

import Modal from "components/Modal";
import ActionButton from "components/ActionButton";
import { SkeletonJustificationCard } from "components/StyledSkeleton";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

import { EvidencesQuery, RequestDetailsFragment } from "src/graphql/graphql";
import { isUndefined } from "src/utils";
import { useEvidences } from "queries/useEvidences";

import Header from "./Header";
import JustificationDetails, { Justification } from "./JustificationDetails";

interface IJustificationModal {
  request: RequestDetailsFragment;
  isRemoval: boolean;
  toggleModal: () => void;
}

const JustificationModal: React.FC<IJustificationModal> = ({ request, toggleModal, isRemoval }) => {
  const { data: evidenceData, isLoading: isLoadingEvidences } = useEvidences(request.externalDisputeID);
  const [justification, setJustification] = useState<Justification>();

  useEffect(() => {
    if (isUndefined(evidenceData)) return;

    const evidence = getEvidenceForRequest(request, evidenceData.evidences, isRemoval);

    if (evidence) {
      setJustification(evidence);
    }
  }, [evidenceData, isRemoval, request]);

  return (
    <Modal className="gap-8" {...{ toggleModal }}>
      <Header text={isRemoval ? "Removal Requested" : "Request Challenged"} />
      <h3 className="w-full m-0 mb-1 text-center">Justification</h3>
      {isLoadingEvidences ? (
        <SkeletonJustificationCard />
      ) : justification ? (
        <JustificationDetails {...{ justification }} />
      ) : (
        <label className="w-full">No Justification provided</label>
      )}
      <div className="flex flex-wrap justify-between w-full mt-9 gap-y-2">
        <Button variant="secondary" text="Return" onClick={toggleModal} />
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

/**
 * @description returns the correct evidence relating to the request
 * @need this is needed since the removal request might not have the evidence, same for challenge request.
 *       to get the correct evidence for the request, we match the timestamp of the request and evidence,
 *       if both are same , it means the evidence was created in the same block as that request and belongs to the request
 * @returns the evidence for the request if it exists, otherwise null
 */
const getEvidenceForRequest = (
  request: RequestDetailsFragment,
  evidences: EvidencesQuery["evidences"],
  isRemoval: boolean
) => {
  if (isRemoval) {
    if (evidences.length > 0 && evidences[0].timestamp === request.submissionTime) {
      return evidences[0];
    } else {
      return null;
    }
  }

  // in case of challenge either the first or the second one can be the challenge evidence,
  // in case of registration challenge, the 1st one is the challenge evidence,
  // or if the removal request did not have any justification, the 1st one could be the challenge justification
  if (evidences.length > 0 && evidences[0].timestamp === request.challengeTime) return evidences[0];
  if (evidences.length > 1 && evidences[1].timestamp === request.challengeTime) return evidences[1];

  return null;
};

export default JustificationModal;
