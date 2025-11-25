import React from "react";
import LightButton from "components/LightButton";
import DarkModeIcon from "svgs/menu-icons/dark-mode.svg";
import HelpIcon from "svgs/menu-icons/help.svg";
import LightModeIcon from "svgs/menu-icons/light-mode.svg";
// import NotificationsIcon from "svgs/menu-icons/notifications.svg";
import SettingsIcon from "svgs/menu-icons/settings.svg";
import { useTheme } from "hooks/useToggleThemeContext";
import { IHelp, ISettings } from "..";
import clsx from "clsx";

const Menu: React.FC<ISettings & IHelp> = ({ toggleIsHelpOpen, toggleIsSettingsOpen }) => {
  const [theme, toggleTheme] = useTheme();
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
    <div className="flex flex-col lg:flex-row">
      {buttons.map(({ text, Icon, onClick }, index) => (
        <div
          key={index}
          className={clsx(
            "flex items-center min-h-8",
            "[&_.button-text]:block lg:[&_.button-text]:hidden",
            "not-dark:not-lg:[&_.button-svg]:fill-black/75 not-dark:not-lg:hover:[&_.button-svg]:fill-black"
          )}
        >
          <LightButton {...{ text, onClick, Icon }} />
        </div>
      ))}
    </div>
  );
};

export default Menu;
