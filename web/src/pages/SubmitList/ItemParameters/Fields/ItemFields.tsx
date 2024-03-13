import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import LabeledInput from "components/LabeledInput";
import { Field, FieldTypes } from ".";
import { Switch, _IItem1 } from "@kleros/ui-components-library";
import LabeledDropdown from "../../LabeledDropdown";
import WithHelpTooltip from "components/WithHelpTooltip";

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

const ItemFields: React.FC<{ fields: Field[] }> = ({ fields }) => {
  const items: _IItem1[] = FieldTypes.map((item) => ({ text: item, value: item }));
  return (
    <Container>
      {fields?.map((field, index) => (
        <FieldsContainer key={field?.id}>
          <Title>{`Field ${index + 1} :`}</Title>
          <InnerContainer>
            <LabeledDropdown label="Type" items={items} callback={() => {}} defaultValue={items[0].value} />
            <LabeledInput name="name" topLeftLabel={`Name`} placeholder="Item Name" value={field.name} />
            <IndexedContainer>
              <WithHelpTooltip
                tooltipMsg="Indexed fields are searchable. Toggle (On) fields are displayed on both the item card and internally on the item page. Toggle (Off) fields are displayed just internally on the item page."
                place="left"
              >
                <label>Indexed</label>
              </WithHelpTooltip>
              <Switch checked={field.indexed} />
            </IndexedContainer>
          </InnerContainer>
          <LabeledInput
            name="description"
            topLeftLabel={`Description`}
            placeholder="Item description"
            value={field.description}
          />
        </FieldsContainer>
      ))}
    </Container>
  );
};
export default ItemFields;
