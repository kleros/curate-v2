import React from "react";

import { Route, Routes } from "react-router-dom";

import { RegistryDetailsProvider } from "context/RegistryDetailsContext";

import RegistriesFetcher from "./RegistriesFetcher";
import RegistryDetails from "./RegistryDetails";
import ItemDisplay from "./ItemDisplay";
import Breadcrumb from "./StyledBreadcrumb";
import clsx from "clsx";

const landscapePaddingCalc = "lg:p-[48px_var(--spacing-fluid-0-32)_60px]";

const AllLists: React.FC = () => (
  <div
    className={clsx(
      "w-full bg-klerosUIComponentsLightBackground px-4 pt-8 pb-10 mx-auto max-w-landscape",
      landscapePaddingCalc
    )}
  >
    <Breadcrumb />
    <Routes>
      <Route path="/display/:page/:order/:filter" element={<RegistriesFetcher />} />
      <Route path="/item/:itemId" element={<ItemDisplay />} />
      <Route
        path="/:id/*"
        element={
          <RegistryDetailsProvider>
            <RegistryDetails />
          </RegistryDetailsProvider>
        }
      />
    </Routes>
  </div>
);

export default AllLists;
