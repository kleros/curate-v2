import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";

import Modal from "components/Modal";
import ActionButton from "components/ActionButton";
import { SkeletonJustificationCard } from "components/StyledSkeleton";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

import { EvidencesQuery, RequestDetailsFragment } from "src/graphql/graphql";
import { isUndefined } from "src/utils";
import { getIpfsUrl } from "utils/getIpfsUrl";
import fetchJsonIpfs from "utils/fetchJsonIpfs";
import { useEvidences } from "queries/useEvidences";

import Header from "./Header";
import JustificationDetails, { Justification } from "./JustificationDetails";

const StyledModal = styled(Modal)`
  gap: 30px;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 38px;
  row-gap: 8px;
`;

const StyledLabel = styled.label`
  width: 100%;
`;

const JustificationText = styled.h3`
  width: 100%;
  margin: 0px;
  margin-bottom: 4px;
  text-align: center;
`;

interface IJustificationModal {
  request: RequestDetailsFragment;
  isRemoval: boolean;
  toggleModal: () => void;
}

const JustificationModal: React.FC<IJustificationModal> = ({ request, toggleModal, isRemoval }) => {
  const { data: evidenceData, isLoading: isLoadingEvidences } = useEvidences(request.externalDisputeID);
  const [justification, setJustification] = useState<Justification>();
  const [isLoadingJustification, setIsLoadingJustification] = useState(false);

  useEffect(() => {
    if (isUndefined(evidenceData)) return;
    setIsLoadingJustification(true);

    const uri = getEvidenceUriForRequest(request, evidenceData.evidences, isRemoval);

    if (!uri) {
      setIsLoadingJustification(false);
      return;
    }

    fetchJsonIpfs(getIpfsUrl(uri))
      .then((res) => {
        setJustification(res as Justification);
      })
      .finally(() => setIsLoadingJustification(false));
  }, [evidenceData, isRemoval, request]);

  return (
    <StyledModal {...{ toggleModal }}>
      <Header text={isRemoval ? "Removal Requested" : "Request Challenged"} />
      <JustificationText>Justification</JustificationText>
      {isLoadingEvidences || isLoadingJustification ? (
        <SkeletonJustificationCard />
      ) : justification ? (
        <JustificationDetails {...{ justification }} />
      ) : (
        <StyledLabel>No Justification provided</StyledLabel>
      )}
      <ButtonsContainer>
        <Button variant="secondary" text="Return" onClick={toggleModal} />
        {!request.resolved && (
          <ActionButton
            isItem
            itemId={request.item.itemID}
            status={mapFromSubgraphStatus(request.item.status, request.disputed)}
            registryAddress={request.item.registryAddress}
          />
        )}
      </ButtonsContainer>
    </StyledModal>
  );
};

/**
 * @description returns the correct evidence relating to the request
 * @need this is needed since the removal request might not have the evidence, same for challenge request.
 *       to get the correct evidence for the request, we match the timestamp of the request and evidence,
 *       if both are same , it means the evidence was created in the same block as that request and belongs to the request
 * @returns the evidence uri for the request if it exists, otherwise null
 */
const getEvidenceUriForRequest = (
  request: RequestDetailsFragment,
  evidences: EvidencesQuery["evidences"],
  isRemoval: boolean
) => {
  if (isRemoval) {
    if (evidences.length > 0 && evidences[0].timestamp === request.submissionTime) {
      return evidences[0].evidence;
    } else {
      return null;
    }
  }

  // in case of challenge either the first or the second one can be the challenge evidence,
  // in case of registration challenge, the 1st one is the challenge evidence,
  // or if the removal request did not have any justification, the 1st one could be the challenge justification
  if (evidences.length > 0 && evidences[0].timestamp === request.challengeTime) return evidences[0].evidence;
  if (evidences.length > 1 && evidences[1].timestamp === request.challengeTime) return evidences[1].evidence;

  return null;
};

export default JustificationModal;
