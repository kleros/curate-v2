import React, { useMemo } from "react";
import { DropdownSelect, Switch, TextField } from "@kleros/ui-components-library";
import WithHelpTooltip from "components/WithHelpTooltip";
import { FieldTypes, useSubmitListContext } from "context/SubmitListContext";
import { toast } from "react-toastify";
import { OPTIONS } from "utils/wrapWithToast";
import { capitalize } from "utils/index";
import useIsDesktop from "hooks/useIsDesktop";
import clsx from "clsx";

type IItem = React.ComponentProps<typeof DropdownSelect>["items"][number];

const ItemFields: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();
  const isDesktop = useIsDesktop();
  const items: IItem[] = FieldTypes.map((item) => ({ id: item, text: capitalize(item), itemValue: item }));

  const canIndexMoreFields = useMemo(() => {
    const indexedFields = listMetadata.columns.filter((field) => field.isIdentifier);
    return indexedFields.length < 4;
  }, [listMetadata]);

  const handleFieldDataWrite = (key: number, fieldLabel: string, fieldDescription: string) => {
    let columns = listMetadata.columns ?? [];
    columns[key] = { ...columns[key], [fieldLabel]: fieldDescription };
    setListMetadata({ ...listMetadata, columns });
  };

  const handleFieldTypeWrite = (val: (typeof FieldTypes)[number], key: number) => {
    let columns = listMetadata.columns ?? [];
    columns[key] = { ...columns[key], type: val };
    setListMetadata({ ...listMetadata, columns });
  };

  const handleFieldIndexedWrite = (val: boolean, key: number) => {
    let columns = listMetadata.columns ?? [];

    // check if we can index more fields
    if (!columns[key].isIdentifier && !canIndexMoreFields) {
      toast.info("Can only index 4 fields.", OPTIONS);
      return;
    }

    columns[key] = { ...columns[key], isIdentifier: val };
    setListMetadata({ ...listMetadata, columns });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {listMetadata.columns?.map((field, index) => (
        <div className="flex flex-col gap-6 w-full" key={field?.id}>
          <h3 className="w-full text-base text-klerosUIComponentsPrimaryText font-semibold">{`Field ${index + 1}:`}</h3>
          <div
            className={clsx(
              "flex flex-col gap-6 w-full",
              "lg:grid lg:grid-cols-[min-content_minmax(200px,274px)_auto]"
            )}
          >
            <DropdownSelect
              className="[&_span]:text-klerosUIComponentsSecondaryText"
              label="Type"
              items={items}
              callback={(item) => handleFieldTypeWrite(item.itemValue, index)}
              defaultSelectedKey={field.type}
            />
            <TextField
              label="Name"
              placeholder="Item Name"
              value={field.label}
              onChange={(value) => handleFieldDataWrite(index, "label", value)}
            />
            <div className={clsx("flex flex-row gap-4", "lg:flex-col lg:justify-between lg:items-end lg:h-full")}>
              <WithHelpTooltip
                tooltipMsg="Indexed fields are searchable. Toggle (On) fields are displayed on both the item card and internally on the item page. Toggle (Off) fields are displayed just internally on the item page."
                place={isDesktop ? "left" : "right"}
              >
                <label className="text-klerosUIComponentsPrimaryText">Indexed</label>
              </WithHelpTooltip>
              <Switch
                name="isIdentifier"
                isSelected={field.isIdentifier}
                onChange={(isSelected) => handleFieldIndexedWrite(isSelected, index)}
              />
            </div>
          </div>
          <TextField
            className="w-full"
            label="Description"
            placeholder="Item description"
            value={field.description}
            onChange={(value) => handleFieldDataWrite(index, "description", value)}
          />
        </div>
      ))}
    </div>
  );
};
export default ItemFields;
