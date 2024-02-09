import { useLocation } from "react-router-dom";
// import { Escrow_Filter } from "src/graphql/graphql";

export const encodeListURIFilter = (filter): string => {
  if (Object.keys(filter).length === 0) {
    return "all";
  } else {
    return encodeURI(JSON.stringify(filter));
  }
};

export const decodeListURIFilter = (filter: string) => {
  if (filter === "all") {
    return {};
  } else {
    return JSON.parse(decodeURI(filter));
  }
};

export const useListRootPath = () => {
  const location = useLocation();
  return location.pathname.split("/").slice(0, -3).join("/");
};

export const encodeItemURIFilter = (filter): string => {
  if (Object.keys(filter).length === 0) {
    return "all";
  } else {
    return encodeURI(JSON.stringify(filter));
  }
};

export const decodeItemURIFilter = (filter: string) => {
  if (filter === "all") {
    return {};
  } else {
    return JSON.parse(decodeURI(filter));
  }
};

export const useItemRootPath = () => {
  const location = useLocation();
  return location.pathname.split("/").slice(0, -3).join("/");
};
