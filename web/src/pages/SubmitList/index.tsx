import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import ConnectWallet from "components/ConnectWallet";
import HeroImage from "components/HeroImage";
import Timeline from "./Timeline";
import Title from "./ListParameters/Title";
import Description from "./ListParameters/Description";
import LogoUpload from "./ListParameters/LogoUpload";
import Policy from "./ListParameters/Policy";
import Deposit from "./ItemParameters/Deposit";
import Fields from "./ItemParameters/Fields";
import ItemPreview from "./ItemParameters/ItemPreview";
import CustomName from "./ItemParameters/CustomName";
import AdvancedParameters from "./AdvancedParameters";
import DeployList from "./DeployList";
import EnsureAuth from "components/EnsureAuth";
import clsx from "clsx";

const SubmitList: React.FC = () => {
  const location = useLocation();

  const { isConnected } = useAccount();
  const isTimelineHidden =
    location.pathname.includes("/list-preview") ||
    location.pathname.includes("/item-preview") ||
    location.pathname.includes("/advanced") ||
    location.pathname.includes("/deploy");

  return (
    <>
      <HeroImage />
      <div
        className={clsx(
          "flex flex-col w-full max-w-landscape",
          "my-0 mx-auto bg-klerosUIComponentsLightBackground",
          "pt-fluid-24-28 pb-fluid-76-96 px-fluid-24-32"
        )}
      >
        {isConnected && !isTimelineHidden ? (
          <label
            className={clsx("hidden", "lg:text-klerosUIComponentsSecondaryPurple", "lg:flex lg:mb-5 lg:px-fluid-25-65")}
          >
            Create a List
          </label>
        ) : null}
        {isConnected ? (
          <EnsureAuth className="self-center">
            <div className="relative flex justify-center">
              {isConnected && !isTimelineHidden ? <Timeline /> : null}
              <Routes>
                <Route index element={<Navigate to="title" replace />} />
                <Route path="/title/*" element={<Title />} />
                <Route path="/description/*" element={<Description />} />
                <Route path="/logo/*" element={<LogoUpload />} />
                <Route path="/policy/*" element={<Policy />} />
                <Route path="/deposit/*" element={<Deposit />} />
                <Route path="/fields/*" element={<Fields />} />
                <Route path="/item-preview/*" element={<ItemPreview />} />
                <Route path="/custom/*" element={<CustomName />} />
                <Route path="/advanced/*" element={<AdvancedParameters />} />
                <Route path="/deploy/*" element={<DeployList />} />
              </Routes>
            </div>
          </EnsureAuth>
        ) : (
          <div className="flex flex-col items-center text-center text-klerosUIComponentsPrimaryText">
            To create a new list, connect first
            <hr />
            <ConnectWallet />
          </div>
        )}
      </div>
    </>
  );
};

export default SubmitList;
