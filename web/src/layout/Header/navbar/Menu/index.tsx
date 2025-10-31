import React from "react";
import LightButton from "components/LightButton";
import DarkModeIcon from "svgs/menu-icons/dark-mode.svg";
import HelpIcon from "svgs/menu-icons/help.svg";
import LightModeIcon from "svgs/menu-icons/light-mode.svg";
// import NotificationsIcon from "svgs/menu-icons/notifications.svg";
import SettingsIcon from "svgs/menu-icons/settings.svg";
import { useToggleTheme } from "hooks/useToggleThemeContext";
import { IHelp, ISettings } from "..";

const Menu: React.FC<ISettings & IHelp> = ({ toggleIsHelpOpen, toggleIsSettingsOpen }) => {
  const [theme, toggleTheme] = useToggleTheme();
  const isLightTheme = theme === "light";

  const buttons = [
    // { text: "Notifications", Icon: NotificationsIcon },
    {
      text: "Settings",
      Icon: SettingsIcon,
      onClick: () => toggleIsSettingsOpen(),
    },
    {
      text: "Help",
      Icon: HelpIcon,
      onClick: () => {
        toggleIsHelpOpen();
      },
    },
    {
      text: `${isLightTheme ? "Dark" : "Light"} Mode`,
      Icon: isLightTheme ? DarkModeIcon : LightModeIcon,
      onClick: () => toggleTheme(),
    },
  ];

  return (
    <div className="flex flex-col landscape-900:flex-row">
      {buttons.map(({ text, Icon, onClick }) => (
        <div
          key={Icon}
          className={
            "flex items-center min-h-8 [&_button]:p-0 [&_button-text]:block [&_button-svg]:fill-klerosUIComponentsSecondaryPurple " +
            "landscape-900:[&_button-text]:hidden landscape-900:[&_button-svg]:fill-white"
          }
        >
          <LightButton {...{ text, onClick, Icon }} />
        </div>
      ))}
    </div>
  );
};

export default Menu;
