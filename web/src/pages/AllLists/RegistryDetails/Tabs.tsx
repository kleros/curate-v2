import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs as TabsComponent } from "@kleros/ui-components-library";
import PaperIcon from "assets/svgs/icons/paper.svg";
import HistoryIcon from "assets/svgs/icons/history.svg";
import { encodeListURIFilter } from "utils/uri";
import { List_filters } from "consts/filters";
import clsx from "clsx";

const TABS = [
  {
    id: 0,
    text: "List",
    value: 0,
    Icon: PaperIcon,
    path: `list/1/desc/${encodeListURIFilter(List_filters.Active)}`,
    identifier: "list",
    content: null,
  },
  {
    id: 1,
    text: "History",
    value: 1,
    Icon: HistoryIcon,
    path: "history",
    identifier: "history",
    content: null,
  },
];

const Tabs: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const currentPathName = location.pathname.split("/").at(3);

  const findTabIndex = (pathName) => TABS.findIndex(({ identifier }) => pathName.startsWith(identifier));
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

  return (
    <TabsComponent
      className={clsx("w-full mb-12", "*:flex *:flex-wrap", "*:[&_svg]:mr-2")}
      items={TABS}
      callback={(_, value: number) => handleTabChange(value)}
    />
  );
};

export default Tabs;
