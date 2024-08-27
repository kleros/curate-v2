import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRegistryItemsQuery } from "queries/useRegistryAllItemsQuery";
import { json2csv } from "json-2-csv";
import ExportIcon from "svgs/icons/export.svg";

const StyledLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.primaryBlue};
  margin-top: 48px;
  align-self: flex-end;
  cursor: pointer;
`;

const StyledExportIcon = styled(ExportIcon)`
  path {
    stroke: ${({ theme }) => theme.primaryBlue};
  }
`;

const ItemsDownloadLabel: React.FC<{ registryAddress?: string }> = ({ registryAddress }) => {
  const [isPreparing, setIsPreparing] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const { data: items, refetch, isRefetching } = useRegistryItemsQuery(registryAddress);

  useEffect(() => {
    if (!items || !ref.current) return;
    setIsPreparing(true);
    const flattenedItems = items.map((item) => {
      const row = {
        id: item.id,
        status: item.status,
        disputed: item.disputed,
      };

      item.props.forEach((prop) => {
        row[`${prop.label} (${prop.description})`] = prop.value;
      });

      return row;
    });

    const csvData = json2csv(flattenedItems);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = ref.current;

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Kleros-Curate-${registryAddress}.csv`);
      link.click();
    }

    setIsPreparing(false);
  }, [items]);

  return (
    <StyledLink onClick={() => refetch()} aria-disabled={isRefetching} ref={ref}>
      {isRefetching || isPreparing ? (
        <>Exporting list...</>
      ) : (
        <>
          Export as csv <StyledExportIcon />
        </>
      )}
    </StyledLink>
  );
};

export default ItemsDownloadLabel;
