import React, { useMemo } from "react";
import styled from "styled-components";
import { Breadcrumb as BreadcrumbBase } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "svgs/icons/home.svg";
import { useRegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";
import { useLocalStorage } from "hooks/useLocalStorage";

const StyledBreadcrumb = styled(BreadcrumbBase)`
  margin-bottom: 32px;
  align-items: center;
`;

const StyledHomeIcon = styled(HomeIcon)`
  path {
    fill: ${({ theme }) => theme.secondaryText};
  }
  margin-bottom: 3.5px;
`;

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [registryItemID, setRegistryItemId] = useLocalStorage<string>("registryAsItemID", "");

  const [page, listAddress] = useMemo(() => {
    const id = location.pathname.split("/")?.[2];
    switch (id) {
      case "display":
        return ["allLists", undefined];
      case "item": {
        const itemId = location.pathname.split("/")?.[3];
        const [_, address] = itemId.split("@");
        return ["item", address];
      }
      default: {
        const [address, itemId] = id.split("-");
        setRegistryItemId(itemId);
        return ["list", address];
      }
    }
  }, [location]);

  const { data: registryDetails } = useRegistryDetailsQuery(listAddress);

  const breadcrumbItems = useMemo(() => {
    const baseItems = [
      { text: <StyledHomeIcon />, value: "/lists/display/1/desc/all" },
      { text: "All Lists", value: "/lists/display/1/desc/all" },
    ];
    switch (page) {
      case "allLists":
        break;
      case "list":
        baseItems.push({
          text: registryDetails?.registry?.title ?? "List",
          value: "",
        });
        break;
      default:
        baseItems.push(
          {
            text: registryDetails?.registry?.title ?? "List",
            value: `/lists/${listAddress}-${registryItemID}/list/1/desc/all`,
          },
          {
            text: "Item",
            value: "",
          }
        );
        break;
    }
    return baseItems;
  }, [page, listAddress, registryDetails, location]);

  return <StyledBreadcrumb items={breadcrumbItems} clickable callback={(val: string) => navigate(val)} />;
};

export default Breadcrumb;
