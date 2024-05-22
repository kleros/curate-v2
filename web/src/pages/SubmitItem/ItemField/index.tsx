import React from "react";
import styled from "styled-components";
import { useSubmitItemContext } from "context/SubmitItemContext";
import Title from "../Title";
import NavigationButtons from "../NavigationButtons";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import FieldInput from "./FieldInput";
import { isUndefined } from "src/utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 30px;
`;

const ItemField: React.FC = () => {
  const { fields, setFields } = useSubmitItemContext();
  const { id } = useParams();
  const fieldNumber = Number(id ?? 0);

  const { fieldProps } = useRegistryDetailsContext();
  const itemField = fieldProps?.[fieldNumber];
  const value = fields?.values?.[itemField?.label ?? ""];

  const handleWrite = (val: string) => {
    if (!itemField) return;
    const prevFields = fields ?? {};

    if (isUndefined(prevFields.values?.[itemField.label])) prevFields.columns.push(itemField);

    prevFields.values = { ...fields.values, [itemField.label]: val };
    setFields({ ...prevFields });
  };

  return (
    <Container>
      {itemField ? <Title text={itemField?.label} /> : <StyledSkeleton width={100} height={40} />}
      {itemField ? (
        <FieldInput fieldProp={{ ...itemField, value }} handleWrite={handleWrite} />
      ) : (
        <StyledSkeleton width={200} height={100} />
      )}
      <NavigationButtons
        prevRoute={fieldNumber > 0 ? `../item-field/${fieldNumber - 1}` : undefined}
        nextRoute={
          fieldProps && fieldProps?.length - 1 > fieldNumber ? `../item-field/${fieldNumber + 1}` : "../policy"
        }
      />
    </Container>
  );
};

export default ItemField;
