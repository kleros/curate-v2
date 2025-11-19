import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { responsiveSize } from "styles/responsiveSize";
import { useAccount } from "wagmi";
import ConnectWallet from "components/ConnectWallet";
import Timeline from "./Timeline";
import Policy from "./Policy";
import Preview from "./Preview";
import Header from "./Header";
import ItemField from "./ItemField";
import { useRegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import EnsureAuth from "components/EnsureAuth";
import clsx from "clsx";

const SubmitItem: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();
  const [registryAddress, _] = id?.split("-");

  const { data: registryDetails } = useRegistryDetailsQuery(registryAddress?.toLowerCase());
  const { setRegistryDetails } = useRegistryDetailsContext();

  useEffect(() => {
    if (registryDetails && registryDetails?.registry) {
      setRegistryDetails({
        ...registryDetails.registry,
      });
    }
  }, [registryDetails, setRegistryDetails]);

  const { isConnected } = useAccount();
  const isPreviewPage = location.pathname.includes("/preview");

  return (
    <>
      {<Header />}
      <div
        className={clsx("flex flex-col w-full max-w-landscape", "bg-klerosUIComponentsLightBackground my-0 mx-auto")}
        style={{
          paddingInline: responsiveSize(24, 32),
          paddingTop: responsiveSize(24, 28),
          paddingBottom: responsiveSize(76, 96),
        }}
      >
        {isConnected ? (
          <EnsureAuth className="self-center">
            <div className="flex justify-center relative">
              {isConnected && !isPreviewPage ? <Timeline /> : null}
              <Routes>
                <Route index element={<Navigate to="item-field/0" replace />} />
                <Route path="/item-field/:id" element={<ItemField />} />
                <Route path="/policy/*" element={<Policy />} />
                <Route path="/preview/*" element={<Preview />} />
              </Routes>
            </div>
          </EnsureAuth>
        ) : (
          <div className="flex flex-col items-center text-center text-klerosUIComponentsPrimaryText">
            To submit a new item, connect first
            <hr />
            <ConnectWallet />
          </div>
        )}
      </div>
    </>
  );
};

export default SubmitItem;
