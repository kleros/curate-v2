import React from "react";
import Skeleton from "react-loading-skeleton";

export const HistorySkeletonCard = () => (
  <div className="flex flex-col gap-2">
    <Skeleton height={24} width={160} />
    <Skeleton height={18} width={100} />
    <Skeleton height={24} width={160} />
    <Skeleton height={18} width={100} />
  </div>
);

export const SkeletonRegistryCard = () => <Skeleton className="w-full h-fluid-270-296" />;

export const SkeletonJustificationCard = () => (
  <div className="flex flex-col gap-4 w-full">
    <Skeleton className="ml-auto w-fluid-100-160" height={24} />
    <Skeleton height={60} />
    <Skeleton className="w-fluid-60-80" height={24} />
  </div>
);

export const SkeletonRegistryListItem = () => <Skeleton height={62} />;

export const SkeletonEvidenceCard = () => <Skeleton height={146} width="76vw" />;
