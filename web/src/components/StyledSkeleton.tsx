import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { responsiveSize } from "styles/responsiveSize";

export const StyledSkeleton = styled(Skeleton)`
  z-index: 0;
`;

const SkeletonRegistryCardContainer = styled.div`
  width: 100%;
`;

const StyledSkeletonRegistryCard = styled(Skeleton)`
  height: ${responsiveSize(270, 296)};
`;

const StyledSkeletonRegistryListItem = styled(Skeleton)`
  height: 62px;
`;

const StyledSkeletonEvidenceCard = styled(Skeleton)`
  height: 146px;
  width: 76vw;
`;

const HistorySkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const HistoryStatusSkeleton = styled(Skeleton)`
  height: 24px;
  width: 160px;
`;
const HistoryDateSkeleton = styled(Skeleton)`
  height: 18px;
  width: 100px;
`;

const SkeletonJustificationContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const SkeletonJustificationTitle = styled(Skeleton)`
  width: ${responsiveSize(100, 160)};
  height: 24px;
  margin-left: auto;
`;

const SkeletonJustificationDescription = styled(Skeleton)`
  height: 60px;
`;

const SkeletonJustificationAttachment = styled(Skeleton)`
  width: ${responsiveSize(60, 80)};
  height: 24px;
`;

export const HistorySkeletonCard = () => (
  <HistorySkeletonContainer>
    <HistoryStatusSkeleton />
    <HistoryDateSkeleton />
    <HistoryStatusSkeleton />
    <HistoryDateSkeleton />
  </HistorySkeletonContainer>
);

export const SkeletonRegistryCard = () => (
  <SkeletonRegistryCardContainer>
    <StyledSkeletonRegistryCard />
  </SkeletonRegistryCardContainer>
);

export const SkeletonJustificationCard = () => (
  <SkeletonJustificationContainer>
    <SkeletonJustificationTitle />
    <SkeletonJustificationDescription />
    <SkeletonJustificationAttachment />
  </SkeletonJustificationContainer>
);

export const SkeletonRegistryListItem = () => <StyledSkeletonRegistryListItem />;

export const SkeletonEvidenceCard = () => <StyledSkeletonEvidenceCard />;
