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

export const SkeletonRegistryListItem = () => <StyledSkeletonRegistryListItem />;

export const SkeletonEvidenceCard = () => <StyledSkeletonEvidenceCard />;
