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

export const SkeletonRegistryCard = () => (
  <SkeletonRegistryCardContainer>
    <StyledSkeletonRegistryCard />
  </SkeletonRegistryCardContainer>
);

export const SkeletonRegistryListItem = () => <StyledSkeletonRegistryListItem />;

export const SkeletonEvidenceCard = () => <StyledSkeletonEvidenceCard />;
