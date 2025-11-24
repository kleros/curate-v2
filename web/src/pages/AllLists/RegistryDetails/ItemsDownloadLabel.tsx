import React, { useEffect, useRef, useState } from "react";
import { useRegistryItemsQuery } from "queries/useRegistryAllItemsQuery";
import { json2csv } from "json-2-csv";
import ExportIcon from "svgs/icons/export.svg";
import clsx from "clsx";

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
    <a
      className={clsx(
        "flex flex-row items-center self-end gap-2 mt-12",
        "leading-18px hover:underline text-klerosUIComponentsPrimaryBlue cursor-pointer"
      )}
      onClick={() => refetch()}
      aria-disabled={isRefetching}
      ref={ref}
    >
      {isRefetching || isPreparing ? (
        <>Exporting list...</>
      ) : (
        <>
          Export as csv <ExportIcon className="[&_path]:stroke-klerosUIComponentsPrimaryBlue" />
        </>
      )}
    </a>
  );
};

export default ItemsDownloadLabel;
