import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Tabs } from "@kleros/ui-components-library";
import General from "./General";
import NotificationSettings from "./Notifications";
import { ISettings } from "../../index";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

const TABS = [
  {
    id: 0,
    text: "General",
  },
  {
    id: 1,
    text: "Notifications",
  },
];

const Settings: React.FC<ISettings> = ({ toggleIsSettingsOpen, initialTab }) => {
  const [currentTab, setCurrentTab] = useState<number>(initialTab || 0);
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useClickAway(containerRef, () => {
    toggleIsSettingsOpen();
    if (location.hash.includes("#notifications")) navigate("#", { replace: true });
  });
  return (
    <div
      ref={containerRef}
      className={clsx(
        "flex flex-col absolute max-h-[80vh] overflow-y-auto top-[5%] left-1/2 transform -translate-x-1/2 z-1",
        "bg-klerosUIComponentsWhiteBackground border border-solid border-klerosUIComponentsStroke rounded-[3px]",
        "lg:mt-16 lg:top-0 lg:right-0 lg:left-auto lg:transform-none lg:translate-x-0"
      )}
    >
      <div className="flex justify-center text-2xl mt-6 text-klerosUIComponentsPrimaryText">Settings</div>
      <Tabs
        className="py-0 px-[calc(8px+(32-8)*((100vw-300px)/(1250-300)))] max-w-[660px] w-[86vw] lg:w-[calc(300px+(424-300)*((100vw-300px)/(1250-300)))]"
        currentValue={currentTab}
        items={TABS}
        callback={(n: number) => {
          setCurrentTab(n);
        }}
      />
      {currentTab === 0 ? <General /> : <NotificationSettings {...{ toggleIsSettingsOpen }} />}
    </div>
  );
};

export default Settings;
