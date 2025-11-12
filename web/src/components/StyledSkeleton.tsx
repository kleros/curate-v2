import React from "react";
import Skeleton from "react-loading-skeleton";
import { responsiveSize } from "styles/responsiveSize";

export const HistorySkeletonCard = () => (
  <div className="flex flex-col gap-2">
    <Skeleton height={24} width={160} />
    <Skeleton height={18} width={100} />
    <Skeleton height={24} width={160} />
    <Skeleton height={18} width={100} />
  </div>
);

export const SkeletonRegistryCard = () => (
  <div className="w-full">
    <Skeleton height={responsiveSize(270, 296)} />
  </div>
);

export const SkeletonJustificationCard = () => (
  <div className="flex flex-col gap-4 w-full">
    <Skeleton className="ml-auto" height={24} width={responsiveSize(100, 160)} />
    <Skeleton height={60} />
    <Skeleton height={24} width={responsiveSize(60, 80)} />
  </div>
);

export const SkeletonRegistryListItem = () => <Skeleton height={62} />;

export const SkeletonEvidenceCard = () => <Skeleton height={146} width="76vw" />;
