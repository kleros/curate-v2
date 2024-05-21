import React from "react";
import styled from "styled-components";
import { ItemDetailsFragment } from "src/graphql/graphql";
import ItemField from "components/ItemCard/ItemField";

const FieldsContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

interface IFieldsDisplay {
  props: ItemDetailsFragment["props"];
}

const FieldsDisplay: React.FC<IFieldsDisplay> = ({ props }) => {
  // filter out fields based on type and display accordingly
  const imageFields = props.filter((prop) => prop.type === "image");
  const addressFields = props.filter((prop) => prop.type === "address");
  const linkFields = props.filter((prop) => prop.type === "link");
  const fileFields = props.filter((prop) => prop.type === "file");
  const textFields = props.filter((prop) => prop.type === "text");
  const restOfFields = props.filter((prop) => !["text", "address", "link", "image", "file"].includes(prop.type));

  const displayField = addressFields.length || linkFields.length || fileFields.length;
  return (
    <>
      {imageFields.length || textFields.length ? (
        <FieldsContainer>
          {imageFields.map((field) => (
            <ItemField {...field} detailed />
          ))}
          {textFields.map((field) => (
            <ItemField {...field} detailed />
          ))}
        </FieldsContainer>
      ) : null}
      {displayField ? (
        <FieldsContainer>
          {addressFields.map((field) => (
            <ItemField {...field} detailed />
          ))}
          {linkFields.map((field) => (
            <ItemField {...field} detailed />
          ))}
          {fileFields.map((field) => (
            <ItemField {...field} detailed />
          ))}
        </FieldsContainer>
      ) : null}
      <FieldsContainer>
        {restOfFields.map((field) => (
          <ItemField {...field} detailed />
        ))}
      </FieldsContainer>
    </>
  );
};

export default FieldsDisplay;
