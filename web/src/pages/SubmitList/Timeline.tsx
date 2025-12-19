import React from "react";
import { Steps } from "@kleros/ui-components-library";
import { useLocation } from "react-router-dom";

const items = [
  { title: "List", subitems: ["Name", "Description", "Logo", "Policy"] },
  { title: "Item", subitems: ["Deposit", "Fields", "Preview", "Custom"] },
  { title: "Advanced" },
  { title: "Deploy" },
];

const Timeline: React.FC = () => {
  const location = useLocation();

  const routeToIndexMap = {
    "/submit-list/title": 0,
    "/submit-list/description": 0,
    "/submit-list/logo": 0,
    "/submit-list/policy": 0,
    "/submit-list/deposit": 1,
    "/submit-list/fields": 1,
    "/submit-list/item-preview": 1,
    "/submit-list/custom": 1,
    "/submit-list/advanced": 2,
    "/submit-list/deploy": 3,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <Steps className="hidden lg:absolute lg:flex lg:left-[2%] lg:h-[360px]" {...{ items, currentItemIndex }} />;
};

export default Timeline;
