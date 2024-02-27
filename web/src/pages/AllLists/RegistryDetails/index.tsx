import React from "react";
import { IRegistriesGrid } from "components/RegistriesDisplay/RegistriesGrid";
import InformationCard from "components/InformationCard";
import Tabs from "./Tabs";
import List from "./List";
import History from "components/HistoryDisplay";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTheme } from "styled-components";
import ClosedIcon from "assets/svgs/icons/check-circle-outline.svg";

interface IRegistryDetails extends IRegistriesGrid {
  items: [];
  totalItems?: number;
  title?: string;
  className?: string;
}

const RegistryDetails: React.FC<IRegistryDetails> = ({
  items,
  logoURI = "https://ipfs.kleros.io//ipfs/QmZPeWnzHGKwvnckQE2QrdRJiUFqQXvQEZGFHdEAh7raHN/fno.png",
  title = "Address Tags",
  description = "A list of public name tags, associated with Ethereum mainnet contract addresses.",
  totalItems = 3,
  className,
}) => {
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
    <div {...{ className }}>
      <InformationCard title={title} logoURI={logoURI} description={description} />
      <Tabs />
      <Routes>
        <Route path="list/:page/:order/:filter" element={<List />} />
        <Route path="history" element={<History items={historyItems} />} />
        <Route path="*" element={<Navigate to="list/1/desc/all" replace />} />
      </Routes>
    </div>
  );
};

export default RegistryDetails;
