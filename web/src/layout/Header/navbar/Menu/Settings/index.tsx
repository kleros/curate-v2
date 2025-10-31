import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Tabs } from "@kleros/ui-components-library";
import General from "./General";
import NotificationSettings from "./Notifications";
import { ISettings } from "../../index";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  {
    text: "General",
    value: 0,
  },
  {
    text: "Notifications",
    value: 1,
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
      className={
        "flex flex-col absolute max-h-[80vh] overflow-y-auto bg-klerosUIComponentsWhiteBackground top-[5%] left-1/2 transform -translate-x-1/2 z-1 border border-solid border-klerosUIComponentsStroke rounded-[3px] " +
        "landscape-900:mt-16 landscape-900:top-0 landscape-900:right-0 landscape-900:left-auto landscape-900:transform-none"
      }
    >
      <div className="flex justify-center text-2xl mt-6 text-klerosUIComponentsPrimaryText">Settings</div>
      <Tabs
        className="py-0 px-[calc(8px+(32-8)*((100vw-300px)/(1250-300)))] max-w-[660px] landscape-900:w-[calc(300px+(424-300)*((100vw-300px)/(1250-300)))]"
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
