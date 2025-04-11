import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { ItemDetailsFragment } from "src/graphql/graphql";
import ItemField from "components/ItemCard/ItemField";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";

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
  registryAddress: string;
}

const FieldsDisplay: React.FC<IFieldsDisplay> = ({ props, registryAddress }) => {
  const { data: registryDetails } = useRegistryDetailsQuery(registryAddress);

  // checks if the fields exists in the list metadata
  const labelSet = useMemo(() => {
    if (!registryDetails) return new Set<string>();
    return new Set(registryDetails.registry.fieldProps.map((prop) => prop.label));
  }, [registryDetails]);

  const isUnrecognized = useCallback(
    (field: ItemDetailsFragment["props"][number]) => {
      return !labelSet.has(field.label);
    },
    [labelSet]
  );

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
            <ItemField key={field.label} {...field} detailed isUnrecognized={isUnrecognized(field)} />
          ))}
          {textFields.map((field) => (
            <ItemField key={field.label} {...field} detailed isUnrecognized={isUnrecognized(field)} />
          ))}
        </FieldsContainer>
      ) : null}
      {displayField ? (
        <FieldsContainer>
          {addressFields.map((field) => (
            <ItemField key={field.label} {...field} detailed isUnrecognized={isUnrecognized(field)} />
          ))}
          {linkFields.map((field) => (
            <ItemField key={field.label} {...field} detailed isUnrecognized={isUnrecognized(field)} />
          ))}
          {fileFields.map((field) => (
            <ItemField key={field.label} {...field} detailed isUnrecognized={isUnrecognized(field)} />
          ))}
        </FieldsContainer>
      ) : null}
      <FieldsContainer>
        {restOfFields.map((field) => (
          <ItemField key={field.label} {...field} detailed isUnrecognized={isUnrecognized(field)} />
        ))}
      </FieldsContainer>
    </>
  );
};

export default FieldsDisplay;
