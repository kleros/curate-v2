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
import GraphqlBatcherProvider from "./context/GraphqlBatcher";
import { SubmitItemProvider } from "./context/SubmitItemContext";
import SubmitItem from "./pages/SubmitItem";
import SubmitList from "./pages/SubmitList";

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <QueryClientProvider>
        <GraphqlBatcherProvider>
          <RefetchOnBlock />
          <Web3Provider>
            <IsListProvider>
              <SubmitItemProvider>
                <SentryRoutes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="lists/*" element={<AllLists />} />
                    <Route path="submitItem/*" element={<SubmitItem />} />
                    <Route path="submitList/*" element={<SubmitList />} />
                    <Route path="*" element={<h1>404 not found</h1>} />
                  </Route>
                </SentryRoutes>
              </SubmitItemProvider>
            </IsListProvider>
          </Web3Provider>
        </GraphqlBatcherProvider>
      </QueryClientProvider>
    </StyledComponentsProvider>
  );
};

export default App;
