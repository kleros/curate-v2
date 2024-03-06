import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs as TabsComponent } from "@kleros/ui-components-library";
import PaperIcon from "assets/svgs/icons/paper.svg";
import HistoryIcon from "assets/svgs/icons/history.svg";

const StyledTabs = styled(TabsComponent)`
  width: 100%;
  margin-bottom: 48px;
  > * {
    display: flex;
    flex-wrap: wrap;
    > svg {
      margin-right: 8px !important;
    }
  }
`;

const TABS = [
  {
    text: "List",
    value: 0,
    Icon: PaperIcon,
    path: "list",
  },
  {
    text: "History",
    value: 1,
    Icon: HistoryIcon,
    path: "history",
  },
];

const Tabs: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const currentPathName = location.pathname.split("/").at(3);

  const findTabIndex = (pathName) => TABS.findIndex(({ path }) => pathName.startsWith(path));
  const [currentTab, setCurrentTab] = useState(findTabIndex(currentPathName));

  useEffect(() => {
    const newTabIndex = findTabIndex(currentPathName);
    if (currentTab !== newTabIndex) {
      setCurrentTab(newTabIndex);
    }
  }, [currentPathName, currentTab]);

  const handleTabChange = (n: number) => {
    if (n !== currentTab) {
      setCurrentTab(n);
      navigate(`/lists/${id}/${TABS[n].path}`);
    }
  };

  return <StyledTabs currentValue={currentTab} items={TABS} callback={handleTabChange} />;
};

export default Tabs;
