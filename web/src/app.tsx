import React from "react";
import { Route } from "react-router-dom";
import { SentryRoutes } from "./utils/sentry";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import Web3Provider from "context/Web3Provider";
import IsListViewProvider from "context/IsListViewProvider";
import QueryClientProvider from "context/QueryClientProvider";
import StyledComponentsProvider from "context/StyledComponentsProvider";
import Layout from "layout/index";
import Home from "./pages/Home";
import AllLists from "./pages/AllLists";
import GraphqlBatcherProvider from "context/GraphqlBatcher";
import { SubmitItemProvider } from "context/SubmitItemContext";
import SubmitItem from "./pages/SubmitItem";
import SubmitList from "./pages/SubmitList";
import { RegistryDetailsProvider } from "context/RegistryDetailsContext";
import { SubmitListProvider } from "./context/SubmitListContext";
import AttachmentDisplay from "./pages/AttachmentDisplay";
import AtlasProvider from "./context/AtlasProvider";
import Settings from "./pages/Settings";

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <Web3Provider>
        <GraphqlBatcherProvider>
          <QueryClientProvider>
            <AtlasProvider>
              <IsListViewProvider>
                <SubmitListProvider>
                  <SubmitItemProvider>
                    <SentryRoutes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="lists/*" element={<AllLists />} />
                        <Route
                          path="submit-item/:id/*"
                          element={
                            <RegistryDetailsProvider>
                              <SubmitItem />
                            </RegistryDetailsProvider>
                          }
                        />
                        <Route path="submit-list/*" element={<SubmitList />} />
                        <Route path="attachment/*" element={<AttachmentDisplay />} />
                        <Route path="settings/*" element={<Settings />} />
                        <Route path="*" element={<h1>404 not found</h1>} />
                      </Route>
                    </SentryRoutes>
                  </SubmitItemProvider>
                </SubmitListProvider>
              </IsListViewProvider>
            </AtlasProvider>
          </QueryClientProvider>
        </GraphqlBatcherProvider>
      </Web3Provider>
    </StyledComponentsProvider>
  );
};

export default App;
