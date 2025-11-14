import React, { useMemo } from "react";
import { Breadcrumb as BreadcrumbBase } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "svgs/icons/home.svg";
import { useRegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";
import { useLocalStorage } from "hooks/useLocalStorage";
import { encodeListURIFilter } from "utils/uri";
import { List_filters } from "consts/filters";

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
      { text: <HomeIcon className="fill-klerosUIComponentsSecondaryText mb-[3.5px]" />, value: "/" },
      { text: "All Lists", value: `/lists/display/1/desc/${encodeListURIFilter(List_filters.Active)}` },
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

  return (
    <BreadcrumbBase
      className="mb-8 [&_small]:text-sm [&_small]:font-normal"
      items={breadcrumbItems}
      clickable
      callback={(val: string) => navigate(val)}
    />
  );
};

export default Breadcrumb;
