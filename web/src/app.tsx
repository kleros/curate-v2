import React from "react";
import { Route } from "react-router-dom";
import { SentryRoutes } from "./utils/sentry";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import Web3Provider from "context/Web3Provider";
import IsListProvider from "context/IsListProvider";
import QueryClientProvider from "context/QueryClientProvider";
import StyledComponentsProvider from "context/StyledComponentsProvider";
import RefetchOnBlock from "context/RefetchOnBlock";
import Layout from "layout/index";
import Home from "./pages/Home";
import AllLists from "./pages/AllLists";
import SubmitItem from "./pages/SubmitItem";
import { SubmitItemProvider } from "./context/SubmitItemContext";

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <QueryClientProvider>
        <RefetchOnBlock />
        <Web3Provider>
          <IsListProvider>
            <SubmitItemProvider>
              <SentryRoutes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="lists/*" element={<AllLists />} />
                  <Route path="submitItem/*" element={<SubmitItem />} />
                  <Route path="*" element={<h1>404 not found</h1>} />
                </Route>
              </SentryRoutes>
            </SubmitItemProvider>
          </IsListProvider>
        </Web3Provider>
      </QueryClientProvider>
    </StyledComponentsProvider>
  );
};

export default App;
