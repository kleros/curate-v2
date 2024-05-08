import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import LabeledInput from "components/LabeledInput";
import { Switch, _IItem1 } from "@kleros/ui-components-library";
import LabeledDropdown from "../../LabeledDropdown";
import WithHelpTooltip from "components/WithHelpTooltip";
import { FieldTypes, useSubmitListContext } from "context/SubmitListContext";
import { toast } from "react-toastify";
import { OPTIONS } from "utils/wrapWithToast";
import { capitalize } from "utils/index";
import useIsDesktop from "hooks/useIsDesktop";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${landscapeStyle(
    () => css`
      display: grid;
      grid-template-columns: min-content minmax(200px, 274px) auto;
    `
  )}
`;

const Title = styled.h3`
  width: 100%;
  margin: 0px;
`;

const IndexedContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  ${landscapeStyle(
    () => css`
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      align-items: end;
    `
  )}
`;

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.primaryText};
`;

const ItemFields: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();
  const isDesktop = useIsDesktop();
  const items: _IItem1[] = FieldTypes.map((item) => ({ text: capitalize(item), value: item }));

  const canIndexMoreFields = useMemo(() => {
    const indexedFields = listMetadata.columns.filter((field) => field.isIdentifier);
    return indexedFields.length < 4;
  }, [listMetadata]);

  const handleFieldWrite = (event: React.ChangeEvent<HTMLInputElement>, key: number) => {
    let columns = listMetadata.columns ?? [];

    if (event.target.name === "isIdentifier") {
      // check if we can index more fields
      if (!columns[key].isIdentifier && !canIndexMoreFields) {
        toast.info("Can only index 4 fields.", OPTIONS);
        return;
      }
      columns[key] = { ...columns[key], [event.target.name]: !columns[key].isIdentifier };
    } else {
      columns[key] = { ...columns[key], [event.target.name]: event.target.value };
    }
    setListMetadata({ ...listMetadata, columns });
  };

  const handleFieldTypeWrite = (val: string, key: number) => {
    let columns = listMetadata.columns ?? [];

    columns[key] = { ...columns[key], type: val };
    setListMetadata({ ...listMetadata, columns });
  };

  return (
    <Container>
      {listMetadata.columns?.map((field, index) => (
        <FieldsContainer key={field?.id}>
          <Title>{`Field ${index + 1} :`}</Title>
          <InnerContainer>
            <LabeledDropdown
              label="Type"
              items={items}
              callback={(val) => handleFieldTypeWrite(val.toString(), index)}
              defaultValue={field.type}
            />
            <LabeledInput
              name="label"
              topLeftLabel={{ text: `Name` }}
              placeholder="Item Name"
              value={field.label}
              onChange={(event) => handleFieldWrite(event, index)}
            />
            <IndexedContainer>
              <WithHelpTooltip
                tooltipMsg="Indexed fields are searchable. Toggle (On) fields are displayed on both the item card and internally on the item page. Toggle (Off) fields are displayed just internally on the item page."
                place={isDesktop ? "left" : "right"}
              >
                <StyledLabel>Indexed</StyledLabel>
              </WithHelpTooltip>
              <Switch
                name="isIdentifier"
                checked={field.isIdentifier}
                onChange={(event) => handleFieldWrite(event, index)}
              />
            </IndexedContainer>
          </InnerContainer>
          <LabeledInput
            name="description"
            topLeftLabel={{ text: `Description` }}
            placeholder="Item description"
            value={field.description}
            onChange={(event) => handleFieldWrite(event, index)}
          />
        </FieldsContainer>
      ))}
    </Container>
  );
};
export default ItemFields;
