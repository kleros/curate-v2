import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import LabeledInput from "components/LabeledInput";
import { Switch, _IItem1 } from "@kleros/ui-components-library";
import LabeledDropdown from "../../LabeledDropdown";
import WithHelpTooltip from "components/WithHelpTooltip";
import { FieldTypes, useSubmitListContext } from "context/SubmitListContext";

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

const ItemFields: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const items: _IItem1[] = FieldTypes.map((item) => ({ text: item, value: item }));

  const handleFieldWrite = (event: React.ChangeEvent<HTMLInputElement>, key: number) => {
    let columns = listMetadata.columns ?? [];
    if (event.target.name === "isIdentifier") {
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
              defaultValue={items[0].value}
            />
            <LabeledInput
              name="label"
              topLeftLabel={`Name`}
              placeholder="Item Name"
              value={field.label}
              onChange={(event) => handleFieldWrite(event, index)}
            />
            <IndexedContainer>
              <WithHelpTooltip
                tooltipMsg="Indexed fields are searchable. Toggle (On) fields are displayed on both the item card and internally on the item page. Toggle (Off) fields are displayed just internally on the item page."
                place="left"
              >
                <label>Indexed</label>
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
            topLeftLabel={`Description`}
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
