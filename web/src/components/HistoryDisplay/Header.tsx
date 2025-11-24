import React from "react";
import HistoryIcon from "assets/svgs/icons/history.svg";

const Header: React.FC = () => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center justify-center">
        <HistoryIcon width={17} height={16} className="fill-klerosUIComponentsPrimaryText" />
      </div>
      <p>History</p>
    </div>
  );
};

export default Header;
