import React, { useEffect } from "react";
import { useTheme } from "styled-components";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import InformationCard from "components/InformationCard";
import Tabs from "./Tabs";
import List from "./List";
import History from "components/HistoryDisplay";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import ClosedIcon from "assets/svgs/icons/check-circle-outline.svg";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { useItemDetailsQuery } from "queries/useItemDetailsQuery";

const RegistryDetails: React.FC = () => {
  const { id } = useParams();
  const [listAddress, itemId] = id?.split("-");
  const { data: itemDetails } = useItemDetailsQuery(itemId?.toLowerCase());
  const { data: registryDetails } = useRegistryDetailsQuery(listAddress?.toLowerCase());
  const { title, status, logoURI, policyURI, description, items, registerer, setRegistryDetails } =
    useRegistryDetailsContext();

  useEffect(() => {
    if (itemDetails && registryDetails) {
      setRegistryDetails({
        ...registryDetails.registry,
        ...itemDetails.item,
        registerer: registryDetails.registry.registerer,
      });
    }
  }, [itemDetails, registryDetails, setRegistryDetails]);

  const theme = useTheme();

  const historyItems = [
    {
      title: "List Submitted",
      variant: theme.primaryBlue,
      subtitle: "April 06, 2022",
      rightSided: true,
    },
    {
      title: "List Challenged",
      party: "- Case #1369 by Alice.eth",
      variant: theme.secondaryPurple,
      subtitle: "April 07, 2022",
      rightSided: true,
    },
    {
      title: "List Submitted",
      subtitle: "April 06, 2022",
      rightSided: true,
      Icon: ClosedIcon,
    },
  ];

  return (
    <div>
      <InformationCard
        {...{ title, logoURI, description, policyURI, status }}
        registerer={registerer?.id}
        explorerAddress={listAddress}
      />
      <Tabs />
      <Routes>
        <Route path="list/:page/:order/:filter" element={<List {...{ items }} />} />
        <Route path="history" element={<History items={historyItems} />} />
        <Route path="*" element={<Navigate to="list/1/desc/all" replace />} />
      </Routes>
    </div>
  );
};

export default RegistryDetails;
