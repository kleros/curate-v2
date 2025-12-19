import React from "react";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { Link } from "react-router-dom";

interface IReadPolicy {}

const ReadPolicy: React.FC<IReadPolicy> = () => {
  const { policyURI } = useRegistryDetailsContext();
  return (
    <Link className="self-center text-xl mb-8" to={`/attachment/?url=${getIpfsUrl(policyURI ?? "")}`}>
      → Read the policy here ←
    </Link>
  );
};

export default ReadPolicy;
